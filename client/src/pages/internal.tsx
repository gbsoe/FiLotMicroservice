import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Shield, ArrowRightLeft, Send, Key, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function InternalPage() {
  const [activeTab, setActiveTab] = useState("quote");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    inputMint: "So11111111111111111111111111111111111111112", // SOL
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    amountIn: "1000000000", // 1 SOL
    slippagePct: "0.5"
  });

  // Swap form state
  const [swapForm, setSwapForm] = useState({
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amountIn: "1000000000",
    slippagePct: "0.5",
    ownerPubkey: "",
    privateKey: ""
  });

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    fromPrivateKey: "",
    toPublicKey: "",
    amount: "1000000"
  });

  useEffect(() => {
    document.title = "Internal Swap Interface - FiLotMicroservice";
  }, []);

  const handleQuoteSwap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/quote-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Quote Retrieved",
        description: "Swap quote calculated successfully.",
      });
    } catch (error) {
      toast({
        title: "Quote Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/execute-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swapForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Swap Executed",
        description: `Transaction ID: ${data.txid}`,
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/transfer-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Transfer Complete",
        description: `Transaction ID: ${data.txid}`,
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Security Warning */}
      <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 mx-4 mt-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 dark:text-red-200 font-medium">Internal Use Only</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              This interface handles real blockchain transactions with actual funds. Only authorized personnel should access this page.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Internal Swap Interface
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Direct access to Raydium SDK v2 swap functionality for internal operations
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-red-600 border-red-600">
              <Key className="w-3 h-3 mr-1" />
              Requires Private Keys
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <Wallet className="w-3 h-3 mr-1" />
              Live Mainnet
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quote">Get Quote</TabsTrigger>
            <TabsTrigger value="swap">Execute Swap</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Tokens</TabsTrigger>
          </TabsList>

          {/* Quote Tab */}
          <TabsContent value="quote">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Swap Quote Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inputMint">Input Token Mint</Label>
                    <Input
                      id="inputMint"
                      value={quoteForm.inputMint}
                      onChange={(e) => setQuoteForm({...quoteForm, inputMint: e.target.value})}
                      placeholder="So11111111111111111111111111111111111111112"
                    />
                    <p className="text-xs text-slate-500 mt-1">SOL mint address</p>
                  </div>
                  <div>
                    <Label htmlFor="outputMint">Output Token Mint</Label>
                    <Input
                      id="outputMint"
                      value={quoteForm.outputMint}
                      onChange={(e) => setQuoteForm({...quoteForm, outputMint: e.target.value})}
                      placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                    />
                    <p className="text-xs text-slate-500 mt-1">USDC mint address</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amountIn">Amount In (smallest units)</Label>
                    <Input
                      id="amountIn"
                      value={quoteForm.amountIn}
                      onChange={(e) => setQuoteForm({...quoteForm, amountIn: e.target.value})}
                      placeholder="1000000000"
                    />
                    <p className="text-xs text-slate-500 mt-1">1 SOL = 1,000,000,000 lamports</p>
                  </div>
                  <div>
                    <Label htmlFor="slippagePct">Slippage %</Label>
                    <Input
                      id="slippagePct"
                      value={quoteForm.slippagePct}
                      onChange={(e) => setQuoteForm({...quoteForm, slippagePct: e.target.value})}
                      placeholder="0.5"
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended: 0.5%</p>
                  </div>
                </div>

                <Button 
                  onClick={handleQuoteSwap} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Getting Quote..." : "Get Swap Quote"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swap Tab */}
          <TabsContent value="swap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Send className="w-5 h-5" />
                  Execute Swap Transaction
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This will execute a real transaction on Solana mainnet using provided private keys.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="swapInputMint">Input Token Mint</Label>
                    <Input
                      id="swapInputMint"
                      value={swapForm.inputMint}
                      onChange={(e) => setSwapForm({...swapForm, inputMint: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="swapOutputMint">Output Token Mint</Label>
                    <Input
                      id="swapOutputMint"
                      value={swapForm.outputMint}
                      onChange={(e) => setSwapForm({...swapForm, outputMint: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="swapAmountIn">Amount In</Label>
                    <Input
                      id="swapAmountIn"
                      value={swapForm.amountIn}
                      onChange={(e) => setSwapForm({...swapForm, amountIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="swapSlippage">Slippage %</Label>
                    <Input
                      id="swapSlippage"
                      value={swapForm.slippagePct}
                      onChange={(e) => setSwapForm({...swapForm, slippagePct: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ownerPubkey">Owner Public Key</Label>
                  <Input
                    id="ownerPubkey"
                    value={swapForm.ownerPubkey}
                    onChange={(e) => setSwapForm({...swapForm, ownerPubkey: e.target.value})}
                    placeholder="Wallet public key"
                  />
                </div>

                <div>
                  <Label htmlFor="privateKey">Private Key (Base58 or Array)</Label>
                  <Textarea
                    id="privateKey"
                    value={swapForm.privateKey}
                    onChange={(e) => setSwapForm({...swapForm, privateKey: e.target.value})}
                    placeholder="[1,2,3...] or base58 string"
                    className="min-h-20"
                  />
                  <p className="text-xs text-red-500 mt-1">Warning: Never share private keys. This data is not stored.</p>
                </div>

                <Button 
                  onClick={handleExecuteSwap} 
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Executing Swap..." : "Execute Swap (MAINNET)"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Send className="w-5 h-5" />
                  Transfer SPL Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferMint">Token Mint Address</Label>
                  <Input
                    id="transferMint"
                    value={transferForm.mint}
                    onChange={(e) => setTransferForm({...transferForm, mint: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="fromPrivateKey">From Private Key</Label>
                  <Textarea
                    id="fromPrivateKey"
                    value={transferForm.fromPrivateKey}
                    onChange={(e) => setTransferForm({...transferForm, fromPrivateKey: e.target.value})}
                    placeholder="[1,2,3...] or base58 string"
                    className="min-h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="toPublicKey">Recipient Public Key</Label>
                  <Input
                    id="toPublicKey"
                    value={transferForm.toPublicKey}
                    onChange={(e) => setTransferForm({...transferForm, toPublicKey: e.target.value})}
                    placeholder="Recipient wallet address"
                  />
                </div>

                <div>
                  <Label htmlFor="transferAmount">Amount (smallest units)</Label>
                  <Input
                    id="transferAmount"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                    placeholder="1000000"
                  />
                  <p className="text-xs text-slate-500 mt-1">1 USDC = 1,000,000 (6 decimals)</p>
                </div>

                <Button 
                  onClick={handleTransferToken} 
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Transferring..." : "Transfer Tokens (MAINNET)"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {results && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}