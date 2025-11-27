'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Cpu, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface LLMConfig {
  llm_model: string;
  llm_temperature: string;
  llm_max_tokens: string;
  llm_timeout: string;
}

const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast, efficient for most tasks' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Most capable, higher quality' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Previous generation, stable' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Legacy, wide compatibility' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Legacy pro model' },
];

const DEFAULT_CONFIG: LLMConfig = {
  llm_model: 'gemini-2.5-flash',
  llm_temperature: '0.7',
  llm_max_tokens: '8192',
  llm_timeout: '120',
};

export default function LLMConfigPage() {
  const [config, setConfig] = useState<LLMConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/settings?prefix=llm_');
      const data = await response.json();
      if (data.success) {
        setConfig({
          ...DEFAULT_CONFIG,
          ...data.data,
        });
      }
    } catch (error) {
      console.error('Failed to fetch LLM config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(config)) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
      }
      toast.success('LLM configuration saved');
    } catch (error) {
      console.error('Failed to save config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    toast.info('Configuration reset to defaults (not saved)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === config.llm_model);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" />
          LLM Configuration
        </h1>
        <p className="text-muted-foreground">Configure AI model settings for the orchestrator</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Model Selection</CardTitle>
            <CardDescription>Choose the AI model for generation tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={config.llm_model}
                onValueChange={(value) => setConfig({ ...config, llm_model: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedModel && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedModel.name}</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Generation Parameters</CardTitle>
            <CardDescription>Fine-tune model behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <Badge variant="outline">{config.llm_temperature}</Badge>
              </div>
              <Slider
                value={[parseFloat(config.llm_temperature)]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => setConfig({ ...config, llm_temperature: value.toString() })}
              />
              <p className="text-xs text-muted-foreground">
                Lower values produce more focused output, higher values increase creativity
              </p>
            </div>

            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={config.llm_max_tokens}
                onChange={(e) => setConfig({ ...config, llm_max_tokens: e.target.value })}
                min={1024}
                max={32768}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens in the response (1024-32768)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Timeout (seconds)</Label>
              <Input
                type="number"
                value={config.llm_timeout}
                onChange={(e) => setConfig({ ...config, llm_timeout: e.target.value })}
                min={30}
                max={300}
              />
              <p className="text-xs text-muted-foreground">
                Request timeout in seconds (30-300)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Configuration Changes</p>
              <p className="text-sm text-muted-foreground">
                Changes will apply to new generation requests
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={saving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
