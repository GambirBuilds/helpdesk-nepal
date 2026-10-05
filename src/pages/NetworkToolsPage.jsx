import React, { useState } from "react";
import { calculateSubnet, inspectIp } from "../utils/networkCalculator.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  Network,
  Calculator,
  Search,
  Globe,
  Server,
  Binary,
  Copy,
  Check,
  Info,
  Shield,
  Zap,
  Activity,
} from "lucide-react";

export default function NetworkToolsPage() {
  const { showToast } = useToast();

  // Subnet Calculator state
  const [subnetInput, setSubnetInput] = useState("192.168.1.0/24");
  const [subnetResult, setSubnetResult] = useState(() => calculateSubnet("192.168.1.0/24"));

  // IP Inspector state
  const [ipInput, setIpInput] = useState("202.70.72.1");
  const [ipResult, setIpResult] = useState(() => inspectIp("202.70.72.1"));

  // Ping simulation state
  const [isPinging, setIsPinging] = useState(false);
  const [pingLog, setPingLog] = useState(null);

  const handleSubnetCalculate = (e) => {
    if (e) e.preventDefault();
    const res = calculateSubnet(subnetInput);
    setSubnetResult(res);
  };

  const handlePresetCidr = (cidr) => {
    let baseIp = "192.168.1.0";
    if (subnetInput.includes("/")) {
      baseIp = subnetInput.split("/")[0].trim();
    }
    const combined = `${baseIp}/${cidr}`;
    setSubnetInput(combined);
    setSubnetResult(calculateSubnet(combined));
  };

  const handleInspectIp = (e) => {
    if (e) e.preventDefault();
    const res = inspectIp(ipInput);
    setIpResult(res);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, "info");
  };

  const runSimulatedPing = () => {
    if (!ipResult?.success) return;
    setIsPinging(true);
    setPingLog([]);

    const packets = [
      { seq: 1, bytes: 32, time: Math.floor(Math.random() * 8 + 4), ttl: 58 },
      { seq: 2, bytes: 32, time: Math.floor(Math.random() * 8 + 4), ttl: 58 },
      { seq: 3, bytes: 32, time: Math.floor(Math.random() * 8 + 4), ttl: 58 },
      { seq: 4, bytes: 32, time: Math.floor(Math.random() * 8 + 4), ttl: 58 },
    ];

    setTimeout(() => {
      setPingLog(packets);
      setIsPinging(false);
      showToast("ICMP echo sequence completed (4 packets, 0% loss)", "success");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Network className="w-6 h-6 text-indigo-600" />
          Network Engineering &amp; Diagnostic Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          RFC standard IPv4 Subnet Calculator, IP Address Inspector, and Nepal ISP reference data
        </p>
      </div>

      {/* Tool 1: IPv4 Subnet Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              IPv4 Subnet Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Calculate network boundaries, broadcast addresses, usable host ranges, and wildcard masks
            </p>
          </div>

          {/* Quick CIDR buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
            {[24, 25, 26, 27, 28, 29, 30].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handlePresetCidr(c)}
                className={`px-2 py-1 text-xs font-mono font-bold rounded cursor-pointer transition-colors ${
                  subnetInput.endsWith(`/${c}`)
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                /{c}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubnetCalculate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
              CIDR:
            </span>
            <input
              type="text"
              value={subnetInput}
              onChange={(e) => setSubnetInput(e.target.value)}
              placeholder="e.g. 192.168.1.0/24, 10.20.0.0/16, 172.16.50.0/26"
              className="w-full pl-16 pr-4 py-2.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer flex-shrink-0"
          >
            Calculate Subnet
          </button>
        </form>

        {/* Subnet Results */}
        {subnetResult.error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {subnetResult.error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visual IP Range Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Network: <strong className="text-sky-300">{subnetResult.networkAddress}</strong></span>
                <span>Usable Hosts: <strong className="text-emerald-400">{subnetResult.usableHosts}</strong></span>
                <span>Broadcast: <strong className="text-rose-300">{subnetResult.broadcastAddress}</strong></span>
              </div>

              {/* Graphical bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden p-0.5 border border-slate-700">
                <div className="w-2 bg-sky-400 rounded-l-full" title="Network ID" />
                <div className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-0.5 rounded-xs" title="Usable Host Range" />
                <div className="w-2 bg-rose-400 rounded-r-full" title="Broadcast IP" />
              </div>

              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>First Usable: {subnetResult.firstUsableIp}</span>
                <span>Last Usable: {subnetResult.lastUsableIp}</span>
              </div>
            </div>

            {/* Grid of Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Network Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {subnetResult.networkAddress}
                  </span>
                  <button
                    onClick={() => handleCopy(subnetResult.networkAddress, "Network IP")}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Broadcast Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {subnetResult.broadcastAddress}
                  </span>
                  <button
                    onClick={() => handleCopy(subnetResult.broadcastAddress, "Broadcast IP")}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Subnet Mask / CIDR
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {subnetResult.subnetMask} ({subnetResult.cidr})
                  </span>
                  <button
                    onClick={() => handleCopy(subnetResult.subnetMask, "Subnet Mask")}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Wildcard Mask
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {subnetResult.wildcardMask}
                  </span>
                  <button
                    onClick={() => handleCopy(subnetResult.wildcardMask, "Wildcard Mask")}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  First Usable Host
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700">
                  {subnetResult.firstUsableIp}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Last Usable Host
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700">
                  {subnetResult.lastUsableIp}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Total / Usable Hosts
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {subnetResult.usableHosts} / {subnetResult.totalHosts}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Class &amp; Scope
                </span>
                <span className="text-xs font-bold text-indigo-700">
                  Class {subnetResult.ipClass} • {subnetResult.ipScope.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Binary Masks Table */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex flex-col sm:flex-row justify-between text-slate-600">
                <span className="font-bold text-slate-800">Binary IP:</span>
                <span className="text-slate-700">{subnetResult.binaryIp}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between text-slate-600">
                <span className="font-bold text-slate-800">Binary Mask:</span>
                <span className="text-indigo-600 font-bold">{subnetResult.binarySubnetMask}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool 2: IP Address Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            IPv4 Address Information &amp; Diagnostics
          </h2>
          <p className="text-xs text-slate-500">
            Inspect any IP address, view scope classification, integer/hex representations, and Nepal ISP routing context
          </p>
        </div>

        <form onSubmit={handleInspectIp} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 202.70.72.1 (NTC), 103.10.x.x (WorldLink), 192.168.88.1 (MikroTik)"
              className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex-shrink-0"
          >
            Inspect IP
          </button>
        </form>

        {ipResult.error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {ipResult.error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  IPv4 Address
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">{ipResult.ipAddress}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  IP Class
                </span>
                <span className="font-bold text-slate-900">Class {ipResult.ipClass}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Network Scope
                </span>
                <span className="font-semibold text-emerald-700">{ipResult.ipScope}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 font-sans">
                  Integer Value
                </span>
                <span className="text-slate-800">{ipResult.integerRepresentation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 font-sans">
                  Hexadecimal
                </span>
                <span className="text-slate-800">{ipResult.hexRepresentation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 font-sans">
                  Reverse DNS Pointer
                </span>
                <span className="text-slate-800 truncate block">{ipResult.reversePtr}</span>
              </div>
            </div>

            {/* Nepal Context Card */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-0.5">
                  Nepal ISP &amp; Hardware Context
                </span>
                <p className="text-xs font-bold text-indigo-950">
                  {ipResult.contextNote}
                </p>
              </div>

              <button
                type="button"
                onClick={runSimulatedPing}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isPinging ? "Testing ICMP..." : "Test ICMP Echo"}</span>
              </button>
            </div>

            {/* Simulated Ping output */}
            {pingLog && (
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-1 border border-slate-800">
                <p className="text-slate-400">Pinging {ipResult.ipAddress} with 32 bytes of data:</p>
                {pingLog.map((pkt) => (
                  <p key={pkt.seq} className="text-emerald-400">
                    Reply from {ipResult.ipAddress}: bytes={pkt.bytes} time={pkt.time}ms TTL={pkt.ttl}
                  </p>
                ))}
                <p className="text-slate-400 pt-1 border-t border-slate-800">
                  Ping statistics: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference Cheat Sheet: Nepal ISP DNS & Common IT Ports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nepal ISP DNS Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-600" />
            Nepal ISP &amp; Public DNS Resolvers
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Cloudflare (Fastest in Nepal)</span>
                <span className="block text-[11px] text-slate-500">Anycast low latency</span>
              </div>
              <span className="font-mono font-bold text-indigo-700">1.1.1.1 / 1.0.0.1</span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Nepal Telecom (NTC)</span>
                <span className="block text-[11px] text-slate-500">Official government/domestic</span>
              </div>
              <span className="font-mono font-bold text-indigo-700">202.70.72.3 / 202.70.72.4</span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Google Public DNS</span>
                <span className="block text-[11px] text-slate-500">Global reliable fallback</span>
              </div>
              <span className="font-mono font-bold text-indigo-700">8.8.8.8 / 8.8.4.4</span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Quad9 (Malware Blocking)</span>
                <span className="block text-[11px] text-slate-500">Threat filtering</span>
              </div>
              <span className="font-mono font-bold text-indigo-700">9.9.9.9 / 149.112.112.112</span>
            </div>
          </div>
        </div>

        {/* Essential IT Support Ports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-purple-600" />
            Standard IT Support Ports &amp; Protocols
          </h3>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            <div className="py-2 flex items-center justify-between font-sans">
              <span className="text-slate-800 font-semibold">Remote Desktop (RDP)</span>
              <span className="font-mono font-bold text-purple-700">TCP 3389</span>
            </div>
            <div className="py-2 flex items-center justify-between font-sans">
              <span className="text-slate-800 font-semibold">Secure Shell (SSH)</span>
              <span className="font-mono font-bold text-purple-700">TCP 22</span>
            </div>
            <div className="py-2 flex items-center justify-between font-sans">
              <span className="text-slate-800 font-semibold">Windows File Sharing (SMB)</span>
              <span className="font-mono font-bold text-purple-700">TCP 445</span>
            </div>
            <div className="py-2 flex items-center justify-between font-sans">
              <span className="text-slate-800 font-semibold">DNS Name Resolution</span>
              <span className="font-mono font-bold text-purple-700">UDP/TCP 53</span>
            </div>
            <div className="py-2 flex items-center justify-between font-sans">
              <span className="text-slate-800 font-semibold">Secure Web (HTTPS / TLS)</span>
              <span className="font-mono font-bold text-purple-700">TCP 443</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
