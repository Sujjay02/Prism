import React, { useState, useEffect, useRef } from 'react';
import { CodePreviewProps, Viewport } from '../types';
import { ErrorOverlay } from './ErrorOverlay';

const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  full: 0, // 0 means use container width
};

interface ExtendedCodePreviewProps extends CodePreviewProps {
  viewport?: Viewport;
  onAutofix?: (error: string) => void;
  isFixing?: boolean;
}

export const CodePreview: React.FC<ExtendedCodePreviewProps> = ({ html, viewport = 'full', onAutofix, isFixing = false }) => {
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeKey = useRef(0);

  // Track container width for smooth full-width transitions
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Inject error handler script and base target into HTML
  const htmlWithErrorHandler = html.replace(
    '</head>',
    `<base target="_blank">
    <script>
      // Track errors for better debugging
      var errorCount = 0;
      var lastErrorTime = 0;

      window.onerror = function(msg, url, line, col, error) {
        // Throttle errors - max 1 per 100ms
        var now = Date.now();
        if (now - lastErrorTime < 100) return true;
        lastErrorTime = now;
        errorCount++;
        if (errorCount > 5) return true; // Max 5 errors reported

        // Handle generic "Script error." from cross-origin scripts
        var errorMessage = msg;
        if (msg === 'Script error.' || msg === 'Script error') {
          // Try to get more info from the error object
          if (error && error.message) {
            errorMessage = error.message;
          } else if (error && error.stack) {
            errorMessage = error.stack.split('\\n')[0];
          } else {
            // Generic script error - likely from external CDN
            errorMessage = 'External script error (check browser console for details)';
          }
        }

        // Add line/col info if available
        if (line && line > 0) {
          errorMessage += ' (line ' + line + (col ? ', col ' + col : '') + ')';
        }

        window.parent.postMessage({
          type: 'PRISM_IFRAME_ERROR',
          error: errorMessage
        }, '*');
        return true;
      };

      window.addEventListener('unhandledrejection', function(e) {
        var now = Date.now();
        if (now - lastErrorTime < 100) return;
        lastErrorTime = now;
        errorCount++;
        if (errorCount > 5) return;

        var reason = e.reason;
        var errorMessage = 'Unhandled Promise Rejection: ';
        if (reason instanceof Error) {
          errorMessage += reason.message || reason.toString();
        } else if (typeof reason === 'string') {
          errorMessage += reason;
        } else {
          errorMessage += 'Unknown async error';
        }

        window.parent.postMessage({
          type: 'PRISM_IFRAME_ERROR',
          error: errorMessage
        }, '*');
      });
      // Make internal links work within the preview
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link) {
          var href = link.getAttribute('href');
          // Only handle anchor links with actual IDs (not just "#")
          if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            try {
              var target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            } catch (err) {
              // Invalid selector, ignore
            }
          } else if (href === '#') {
            // Prevent default for empty hash links
            e.preventDefault();
          }
        }
      });
    </script></head>`
  );

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'PRISM_IFRAME_ERROR') {
        setRuntimeError(e.data.error);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Clear error on new HTML
  useEffect(() => {
    setRuntimeError(null);
  }, [html]);

  const handleRetry = () => {
    setRuntimeError(null);
    iframeKey.current += 1;
  };

  const handleCopyError = () => {
    if (runtimeError) {
      navigator.clipboard.writeText(runtimeError);
    }
  };

  const isFullWidth = viewport === 'full';
  const targetWidth = isFullWidth ? containerWidth : VIEWPORT_WIDTHS[viewport];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-start justify-center overflow-auto"
      style={{
        backgroundColor: isFullWidth ? 'transparent' : undefined,
      }}
    >
      <div
        className={`relative ${isFullWidth ? '' : 'my-4'}`}
        style={{
          width: isFullWidth ? '100%' : `${targetWidth}px`,
          height: isFullWidth ? '100%' : 'calc(100% - 2rem)',
          maxWidth: '100%',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width, height',
        }}
      >
        <div
          className={`w-full h-full overflow-hidden ${isFullWidth ? '' : 'bg-white dark:bg-zinc-900 shadow-2xl rounded-xl border border-zinc-200 dark:border-zinc-700'}`}
          style={{
            transition: 'box-shadow 0.4s ease, border-radius 0.4s ease',
          }}
        >
          <iframe
            key={iframeKey.current}
            ref={iframeRef}
            title="UI Preview"
            srcDoc={htmlWithErrorHandler}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
          />
        </div>
        {runtimeError && (
          <ErrorOverlay
            error={runtimeError}
            onRetry={handleRetry}
            onCopyError={handleCopyError}
            onDismiss={() => setRuntimeError(null)}
            onAutofix={onAutofix ? () => onAutofix(runtimeError) : undefined}
            isFixing={isFixing}
          />
        )}
      </div>
    </div>
  );
};
