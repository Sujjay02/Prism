import React, { useState, useEffect, useRef } from 'react';
import { CodePreviewProps, Viewport } from '../types';
import { ErrorOverlay } from './ErrorOverlay';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  full: '100%',
};

interface ExtendedCodePreviewProps extends CodePreviewProps {
  viewport?: Viewport;
  onAutofix?: (error: string) => void;
  isFixing?: boolean;
}

export const CodePreview: React.FC<ExtendedCodePreviewProps> = ({ html, viewport = 'full', onAutofix, isFixing = false }) => {
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeKey = useRef(0);

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

  const width = VIEWPORT_WIDTHS[viewport];
  const isFullWidth = viewport === 'full';

  return (
    <div className={`w-full h-full ${isFullWidth ? '' : 'flex items-start justify-center bg-zinc-100 dark:bg-zinc-900/50 overflow-auto p-4'}`}>
      <div
        className={`${isFullWidth ? 'w-full h-full' : 'bg-white dark:bg-zinc-900 shadow-xl rounded-lg overflow-hidden transition-all duration-300'}`}
        style={{
          width: isFullWidth ? '100%' : width,
          height: isFullWidth ? '100%' : 'calc(100% - 2rem)',
          maxWidth: '100%',
        }}
      >
        <div className="relative w-full h-full">
          <iframe
            key={iframeKey.current}
            ref={iframeRef}
            title="UI Preview"
            srcDoc={htmlWithErrorHandler}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
          />
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
    </div>
  );
};
