import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupButton,
} from "@/components/ui/input-group";
import {
    Zap, RefreshCw, ExternalLink, Key, Copy, Trash2
} from "lucide-react";
import { integrations, MOCK_TOKENS } from "./constants";

export function IntegrationsSection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Dịch vụ đã kết nối</CardTitle>
                    <CardDescription>Quản lý các tích hợp của bên thứ ba</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {integrations.map((integration, index) => (
                            <div
                                key={integration.id}
                                className={`p-4 rounded-lg border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${integration.connected
                                    ? "bg-secondary/50 border-border hover:border-accent/50"
                                    : "bg-secondary/20 border-border hover:border-muted-foreground/30"
                                    }`}
                                style={{ animationDelay: `${index * 75}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integration.connected ? "bg-success/20" : "bg-muted"}`}>
                                            <Zap className={`w-5 h-5 ${integration.connected ? "text-success" : "text-muted-foreground"}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{integration.name}</p>
                                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                                        </div>
                                    </div>
                                    <Badge className={integration.connected ? "bg-success/20 text-success border-success/30" : "bg-muted text-muted-foreground border-border"}>
                                        {integration.connected ? "Đã kết nối" : "Chưa kết nối"}
                                    </Badge>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    {integration.connected ? (
                                        <>
                                            <span className="text-xs text-muted-foreground">Lần đồng bộ cuối: {integration.lastSync}</span>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="h-8"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Đồng bộ</Button>
                                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">Ngắt kết nối</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xs text-muted-foreground">Chưa cấu hình</span>
                                            <Button size="sm" className="h-8">Kết nối<ExternalLink className="w-3.5 h-3.5 ml-1.5" /></Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* API Tokens */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-medium">Token API</CardTitle>
                            <CardDescription>Quản lý khóa API cho truy cập tự động</CardDescription>
                        </div>
                        <Button size="sm" variant="outline">Tạo token</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {MOCK_TOKENS.map((token, index) => (
                        <div
                            key={token.id}
                            className="p-3 rounded-lg bg-secondary/30 border border-border animate-in fade-in slide-in-from-left-2"
                            style={{ animationDelay: `${index * 75}ms` }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{token.name}</p>
                                    <p className="text-xs text-muted-foreground">Tạo ngày {token.createdAt} · Lần dùng cuối {token.lastUsed}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <InputGroup className="h-9">
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText><Key className="w-3.5 h-3.5" /></InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    value={`${token.prefix}${token.masked}`}
                                    readOnly className="font-mono text-xs bg-transparent cursor-default"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton size="icon-sm" variant="ghost"
                                        onClick={() => { void navigator.clipboard.writeText(token.masked); toast.success("Đã sao chép"); }}>
                                        <Copy className="w-3.5 h-3.5" />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
