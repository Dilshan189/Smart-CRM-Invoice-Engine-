'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Copy,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  SAMPLE_CHAT_LOGS,
  parseChatLogToInvoice,
  ParseResult,
} from '@/lib/ai-parser';
import { AIParsedInvoiceExtraction, AIParsedItem } from '@/lib/schemas';
import { formatCurrency } from '@/lib/formatters';

interface AIParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtractedInvoice: (data: AIParsedInvoiceExtraction) => void;
}

export function AIParserModal({
  isOpen,
  onClose,
  onApplyExtractedInvoice,
}: AIParserModalProps) {
  const [inputText, setInputText] = useState(SAMPLE_CHAT_LOGS[0].text);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(() =>
    parseChatLogToInvoice(SAMPLE_CHAT_LOGS[0].text)
  );

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    const text = SAMPLE_CHAT_LOGS[index].text;
    setInputText(text);
    const res = parseChatLogToInvoice(text);
    setParseResult(res);
  };

  const handleParse = async () => {
    setIsProcessing(true);
    // Simulate real AI processing latency for realistic feel
    setTimeout(() => {
      const res = parseChatLogToInvoice(inputText);
      setParseResult(res);
      setIsProcessing(false);
    }, 450);
  };

  const handleItemChange = (
    index: number,
    field: keyof AIParsedItem,
    value: any
  ) => {
    if (!parseResult?.data) return;
    const updatedItems = [...parseResult.data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setParseResult({
      ...parseResult,
      data: {
        ...parseResult.data,
        items: updatedItems,
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!parseResult?.data) return;
    const updatedItems = parseResult.data.items.filter((_, i) => i !== index);
    setParseResult({
      ...parseResult,
      data: {
        ...parseResult.data,
        items: updatedItems,
      },
    });
  };

  const calculatedSubtotal =
    parseResult?.data?.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ) || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 940 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background:
              'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
              }}
            >
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  AI Text-to-Invoice Parser
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: 999,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={12} />
                  Zod Structured Outputs
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Converts messy client chat logs, voice transcripts, or emails into validated tabular invoice items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-ai-modal"
            style={{ color: 'var(--text-muted)', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '22px 26px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Preset Buttons */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Test Presets (Click to Load):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SAMPLE_CHAT_LOGS.map((sample, idx) => (
                <button
                  key={idx}
                  id={`btn-preset-${idx}`}
                  onClick={() => handleSelectPreset(idx)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor:
                      activePresetIndex === idx
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(255, 255, 255, 0.04)',
                    color: activePresetIndex === idx ? '#a5b4fc' : 'var(--text-secondary)',
                    border: `1px solid ${
                      activePresetIndex === idx
                        ? 'rgba(99, 102, 241, 0.5)'
                        : 'var(--border-subtle)'
                    }`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Zap size={13} color={activePresetIndex === idx ? '#818cf8' : '#94a3b8'} />
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Messy Client Chat Log / Audio Transcript:
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {inputText.length} characters
              </span>
            </div>
            <textarea
              id="input-ai-chat-log"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste unstructured notes, Slack thread, email or WhatsApp transcript here..."
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              onClick={handleParse}
              id="btn-run-ai-parse"
              disabled={isProcessing}
              className="btn-ai-magic"
              style={{ fontSize: '0.875rem' }}
            >
              <Sparkles size={16} />
              {isProcessing ? 'Validating against Zod Schema...' : 'Extract & Validate Invoice Items'}
            </button>
          </div>

          {/* Results & Zod Structured Output Review */}
          {parseResult && (
            <div
              className="glass-panel"
              style={{
                padding: '20px 22px',
                borderColor: parseResult.success
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
              }}
            >
              {/* Validation Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {parseResult.success ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <AlertCircle size={18} color="#ef4444" />
                  )}
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: parseResult.success ? '#34d399' : '#f87171',
                    }}
                  >
                    {parseResult.success
                      ? '✓ Schema Validated: Strict Zod Structured Output'
                      : 'Schema Validation Error'}
                  </span>
                </div>

                {parseResult.data && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: 6,
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                      }}
                    >
                      Client: <strong>{parseResult.data.detectedClientName || 'Direct'}</strong>
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: 6,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#93c5fd',
                      }}
                    >
                      Terms: <strong>{parseResult.data.detectedPaymentTerms || 'Net 30'}</strong>
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: 6,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#6ee7b7',
                      }}
                    >
                      Confidence: <strong>{Math.round((parseResult.data.confidenceScore || 0.95) * 100)}%</strong>
                    </span>
                  </div>
                )}
              </div>

              {parseResult.error && (
                <div style={{ color: '#f87171', fontSize: '0.85rem' }}>
                  {parseResult.error}
                </div>
              )}

              {/* Tabular Structured Line Items */}
              {parseResult.data && (
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: 10,
                    }}
                  >
                    Tabular Extracted Items ({parseResult.data.items.length}):
                  </div>

                  <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
                      <thead>
                        <tr
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          <th style={{ padding: '8px 10px' }}>Description & Scope</th>
                          <th style={{ padding: '8px 10px', width: 130 }}>Category</th>
                          <th style={{ padding: '8px 10px', width: 80, textAlign: 'right' }}>Qty/Hrs</th>
                          <th style={{ padding: '8px 10px', width: 100, textAlign: 'right' }}>Rate ($)</th>
                          <th style={{ padding: '8px 10px', width: 110, textAlign: 'right' }}>Amount</th>
                          <th style={{ padding: '8px 10px', width: 40 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.data.items.map((item, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <td style={{ padding: '10px 10px' }}>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(idx, 'description', e.target.value)
                                }
                                style={{
                                  width: '100%',
                                  padding: '6px 10px',
                                  fontSize: '0.85rem',
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px 10px' }}>
                              <select
                                value={item.category}
                                onChange={(e) =>
                                  handleItemChange(idx, 'category', e.target.value)
                                }
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  fontSize: '0.8rem',
                                }}
                              >
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Strategy">Strategy</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Retainer">Retainer</option>
                                <option value="Expenses">Expenses</option>
                                <option value="General">General</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                              <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    'quantity',
                                    parseFloat(e.target.value) || 1
                                  )
                                }
                                style={{
                                  width: 70,
                                  textAlign: 'right',
                                  padding: '6px 8px',
                                  fontSize: '0.85rem',
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    'unitPrice',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                style={{
                                  width: 85,
                                  textAlign: 'right',
                                  padding: '6px 8px',
                                  fontSize: '0.85rem',
                                }}
                              />
                            </td>
                            <td
                              style={{
                                padding: '10px 10px',
                                textAlign: 'right',
                                fontWeight: 700,
                                color: '#ffffff',
                                fontSize: '0.9rem',
                              }}
                            >
                              {formatCurrency(
                                item.quantity * item.unitPrice,
                                parseResult.data?.currency || 'USD'
                              )}
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleRemoveItem(idx)}
                                style={{ color: 'var(--text-muted)', padding: 4 }}
                                title="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary & Apply */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 16,
                      paddingTop: 12,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        Extracted Subtotal:{' '}
                      </span>
                      <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                        {formatCurrency(calculatedSubtotal, parseResult.data?.currency || 'USD')}
                      </strong>
                    </div>

                    <button
                      id="btn-apply-ai-items"
                      onClick={() => {
                        if (parseResult.data) {
                          onApplyExtractedInvoice(parseResult.data);
                          onClose();
                        }
                      }}
                      className="btn-primary"
                      style={{ fontSize: '0.9rem', padding: '10px 22px' }}
                    >
                      <span>Insert Items into Invoice</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
