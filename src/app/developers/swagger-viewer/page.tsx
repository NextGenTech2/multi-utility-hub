"use client";

import { useState, useEffect } from "react";
import { load } from "js-yaml";
import { FileCode, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { SWAGGER_FAQS } from "@/data/faqs";


interface SwaggerUIBundleConfig {
  spec: Record<string, unknown>;
  dom_id: string;
  deepLinking?: boolean;
  presets?: unknown[];
  layout?: string;
}

interface SwaggerUIBundleFn {
  (config: SwaggerUIBundleConfig): void;
  presets: {
    apis: unknown;
  };
}

interface WindowWithSwaggerUI {
  SwaggerUIBundle?: SwaggerUIBundleFn;
}

const DEFAULT_YAML = `openapi: 3.0.3
info:
  title: Sample Petstore API
  description: A sample OpenAPI YAML schema to demonstrate the interactive Swagger Previewer.
  version: 1.0.0
servers:
  - url: https://api.petstore.swagger.io/v2
paths:
  /pets:
    get:
      summary: List all pets
      description: Returns all pets from the system.
      responses:
        '200':
          description: A successful response.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
                    tag:
                      type: string
    post:
      summary: Create a pet
      description: Adds a new pet to the store.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
              properties:
                name:
                  type: string
                tag:
                  type: string
      responses:
        '201':
          description: Pet created successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  tag:
                    type: string
`;

export default function SwaggerPreviewPage() {
  const [yamlInput, setYamlInput] = useState(DEFAULT_YAML);
  const [parsedSpec, setParsedSpec] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Lazy initializer to avoid synchronous setState inside mount effect
  const [ready, setReady] = useState(() => {
    if (typeof window !== "undefined") {
      return !!(window as unknown as WindowWithSwaggerUI).SwaggerUIBundle;
    }
    return false;
  });

  // Debounced YAML parsing using js-yaml for Swagger compatibility
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!yamlInput.trim()) {
        setParsedSpec(null);
        setError(null);
        return;
      }
      try {
        // load() from js-yaml is more permissive (matching official Swagger Editor parser)
        const parsed = load(yamlInput) as unknown;
        if (parsed && typeof parsed === "object") {
          setParsedSpec(parsed as Record<string, unknown>);
          setError(null);
        } else {
          throw new Error("Parsed YAML is not an object. Please ensure your schema is structured correctly.");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse YAML syntax";
        setError(message);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [yamlInput]);

  // Load Swagger UI Assets from CDN
  useEffect(() => {
    if (ready) return;

    const cssId = "swagger-ui-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css";
      document.head.appendChild(link);
    }

    const scriptId = "swagger-ui-bundle-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const handleScriptLoad = () => {
      setReady(true);
    };

    script.addEventListener("load", handleScriptLoad);

    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptLoad);
      }
    };
  }, [ready]);

  // Initialize/Update Swagger UI spec rendering
  useEffect(() => {
    if (!ready || !parsedSpec) return;

    const renderTarget = document.getElementById("swagger-ui-target");
    if (!renderTarget) return;

    // Clear previous rendering to force complete redraw
    renderTarget.innerHTML = "";

    try {
      const win = window as unknown as WindowWithSwaggerUI;
      if (win.SwaggerUIBundle) {
        win.SwaggerUIBundle({
          spec: parsedSpec,
          dom_id: "#swagger-ui-target",
          deepLinking: true,
          presets: [
            win.SwaggerUIBundle.presets.apis,
          ],
          layout: "BaseLayout",
        });
      }
    } catch (err: unknown) {
      console.error("SwaggerUI bundle error rendering:", err);
    }
  }, [ready, parsedSpec]);

  const handleClear = () => {
    setYamlInput("");
    setParsedSpec(null);
    setError(null);
  };

  const loadSample = () => {
    setYamlInput(DEFAULT_YAML);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Swagger Previewer Workstation
          </h1>
          <p className="text-sm text-muted">
            Render OpenAPI and Swagger YAML definitions into interactive API docs locally. This swagger editor online viewer parses files fully in-browser.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="Swagger Editor & OpenAPI Viewer | DevToolHub" 
            text="Edit and preview Swagger OpenAPI YAML/JSON specs online free. 100% Client-side." 
          />
        </div>
      </div>


      {/* Split Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[calc(100vh-14rem)]">
        {/* Left Panel: Raw YAML Editor */}
        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden h-[450px] lg:h-full">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 select-none">
              <FileCode className="h-4 w-4 text-zinc-500" />
              OpenAPI YAML Specification
            </span>
            <div className="flex gap-2">
              <button
                onClick={loadSample}
                className="text-xs flex items-center justify-center bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors py-1 px-2.5 rounded cursor-pointer min-h-[30px]"
              >
                Load Sample
              </button>
              <button
                onClick={handleClear}
                className="text-xs flex items-center justify-center gap-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors py-1 px-2.5 rounded cursor-pointer min-h-[30px]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Code Textarea */}
          <div className="flex-1 relative">
            <textarea
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              className="w-full h-full p-4 bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none text-sm leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600 select-text"
              placeholder="Paste your raw OpenAPI YAML spec here..."
              spellCheck="false"
              translate="no"
            />
          </div>

          {/* Interactive Amber Syntax Alert Badge */}
          {error && (
            <div className="border-t border-zinc-900 bg-zinc-900/40 px-4 py-3 select-none">
              <div className="flex items-start gap-2.5 p-3 rounded border border-amber-500/20 bg-amber-950/20 text-amber-400 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Invalid YAML Syntax:</span>{" "}
                  <span className="font-mono opacity-90">{error}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: White Minimalist Interactive Docs Preview Canvas */}
        <div className="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 overflow-y-auto h-[550px] lg:h-full relative shadow-xs [color-scheme:light] dark:[color-scheme:dark]">
          {!ready ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 select-none text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-400 mb-3" />
              <p className="text-sm font-semibold">Loading Swagger UI engine...</p>
              <p className="text-xs text-zinc-400 mt-1">Fetching interactive assets from CDN</p>
            </div>
          ) : !parsedSpec ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 select-none text-zinc-500">
              <FileCode className="h-10 w-10 text-zinc-300 mb-3" />
              <p className="text-sm font-semibold">No Specification Loaded</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Paste a valid OpenAPI YAML schema on the left to render the interactive documentation canvas.
              </p>
            </div>
          ) : (
            <div className="swagger-dark-override w-full min-h-full">
              <style dangerouslySetInnerHTML={{ __html: `
                .dark .swagger-ui {
                  filter: invert(0) !important;
                }
                
                /* Global text colors for dark mode readability */
                .dark .swagger-ui,
                .dark .swagger-ui p,
                .dark .swagger-ui li,
                .dark .swagger-ui h1,
                .dark .swagger-ui h2,
                .dark .swagger-ui h3,
                .dark .swagger-ui h4,
                .dark .swagger-ui h5,
                .dark .swagger-ui h6,
                .dark .swagger-ui table thead tr th,
                .dark .swagger-ui table tbody tr td,
                .dark .swagger-ui .info .title,
                .dark .swagger-ui .info p,
                .dark .swagger-ui .opblock .opblock-summary-operation-id,
                .dark .swagger-ui .opblock .opblock-summary-path,
                .dark .swagger-ui .opblock .opblock-summary-path__deprecated,
                .dark .swagger-ui .opblock .opblock-summary-description,
                .dark .swagger-ui .opblock .opblock-section-header h4,
                .dark .swagger-ui .opblock .opblock-title_normal,
                .dark .swagger-ui .parameter__name,
                .dark .swagger-ui .parameter__type,
                .dark .swagger-ui .parameter__in,
                .dark .swagger-ui .response-col_status,
                .dark .swagger-ui .response-col_description,
                .dark .swagger-ui .tab li {
                  color: #f4f4f5 !important;
                }

                .dark .swagger-ui .model-box,
                .dark .swagger-ui .model,
                .dark .swagger-ui .model-title,
                .dark .swagger-ui table.model tr {
                  color: #f4f4f5 !important;
                  background-color: transparent !important;
                }
                .dark .swagger-ui .property,
                .dark .swagger-ui .prop-name {
                  color: #e4e4e7 !important;
                }
                .dark .swagger-ui .prop-type {
                  color: #a1a1aa !important;
                }
                /* Expand/collapse carets and all SVG arrows */
                .dark .swagger-ui .caret,
                .dark .swagger-ui .model-toggle::after {
                  filter: invert(1) brightness(2) !important;
                }
                .dark .swagger-ui svg {
                  fill: #f4f4f5 !important;
                }
                
                /* Endpoints / Operations Blocks Backgrounds */
                .dark .swagger-ui .opblock {
                  background: rgba(255, 255, 255, 0.03) !important;
                  border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .dark .swagger-ui .opblock.opblock-get {
                  background: rgba(97, 175, 254, 0.1) !important;
                  border-color: rgba(97, 175, 254, 0.3) !important;
                }
                .dark .swagger-ui .opblock.opblock-post {
                  background: rgba(73, 204, 144, 0.1) !important;
                  border-color: rgba(73, 204, 144, 0.3) !important;
                }
                .dark .swagger-ui .opblock.opblock-put {
                  background: rgba(252, 161, 48, 0.1) !important;
                  border-color: rgba(252, 161, 48, 0.3) !important;
                }
                .dark .swagger-ui .opblock.opblock-delete {
                  background: rgba(249, 62, 62, 0.1) !important;
                  border-color: rgba(249, 62, 62, 0.3) !important;
                }
                .dark .swagger-ui .opblock-summary:hover {
                  background: rgba(255, 255, 255, 0.05) !important;
                }

                /* Schemas block and borders */
                .dark .swagger-ui section.models {
                  border: 1px solid rgba(255, 255, 255, 0.15) !important;
                  border-radius: 4px;
                }
                .dark .swagger-ui section.models h4 {
                  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
                }
                .dark .swagger-ui section.models .model-container {
                  background: rgba(255, 255, 255, 0.05) !important;
                  border-radius: 4px;
                  margin: 0 10px 15px 10px !important;
                  padding: 10px !important;
                  border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
              ` }} />
              <div className="swagger-ui w-full min-h-full">
                {/* Target for Swagger UI Bundle Rendering */}
                <div id="swagger-ui-target" className="w-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={SWAGGER_FAQS} idPrefix="swagger-faq" />
      </div>
    </div>
  );
}
