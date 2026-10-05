/**
 * IPv4 Subnet Calculator and IP Information Utilities
 * Implements pure RFC standard bitwise IPv4 calculations.
 */

// Convert 32-bit unsigned int to dotted-decimal string
export function intToIp(intVal) {
  return [
    (intVal >>> 24) & 255,
    (intVal >>> 16) & 255,
    (intVal >>> 8) & 255,
    intVal & 255,
  ].join(".");
}

// Convert dotted-decimal string to 32-bit unsigned int
export function ipToInt(ipStr) {
  const parts = ipStr.trim().split(".");
  if (parts.length !== 4) return null;
  let num = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255 || String(octet) !== parts[i].trim()) {
      return null;
    }
    num = (num << 8) + octet;
  }
  return num >>> 0;
}

// Convert 32-bit int to 32-bit binary string formatted with dots
export function intToBinaryString(intVal) {
  const binary = (intVal >>> 0).toString(2).padStart(32, "0");
  return `${binary.slice(0, 8)}.${binary.slice(8, 16)}.${binary.slice(16, 24)}.${binary.slice(24, 32)}`;
}

// Get IP Class (A, B, C, D, E)
export function getIpClass(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 126) return "A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D (Multicast)";
  if (firstOctet >= 240 && firstOctet <= 255) return "E (Experimental)";
  return "Unknown";
}

// Determine IP Scope (Private RFC 1918, Loopback, APIPA, Public, etc.)
export function getIpScope(ipStr) {
  const parts = ipStr.split(".").map(Number);
  if (parts.length !== 4) return "Invalid";
  const [o1, o2] = parts;

  if (o1 === 10) return "Private (RFC 1918 - Class A)";
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return "Private (RFC 1918 - Class B)";
  if (o1 === 192 && o2 === 168) return "Private (RFC 1918 - Class C)";
  if (o1 === 127) return "Loopback (localhost)";
  if (o1 === 169 && o2 === 254) return "Link-Local / APIPA (No DHCP)";
  if (o1 === 224) return "Multicast";
  if (o1 >= 240) return "Reserved/Experimental";
  return "Public (Internet Routable)";
}

// Parse input string: supports "192.168.1.0/24" or IP with separate mask
export function calculateSubnet(inputStr) {
  if (!inputStr) {
    return { error: "Please enter an IPv4 address and CIDR prefix (e.g., 192.168.1.0/24)" };
  }

  const trimmed = inputStr.trim();
  let ipPart = "";
  let cidrPart = 24;

  if (trimmed.includes("/")) {
    const slashIdx = trimmed.indexOf("/");
    ipPart = trimmed.substring(0, slashIdx).trim();
    const parsedCidr = parseInt(trimmed.substring(slashIdx + 1).trim(), 10);
    if (isNaN(parsedCidr) || parsedCidr < 0 || parsedCidr > 32) {
      return { error: "CIDR prefix must be an integer between 0 and 32 (e.g. /24)" };
    }
    cidrPart = parsedCidr;
  } else {
    ipPart = trimmed;
    cidrPart = 24; // default
  }

  const ipNum = ipToInt(ipPart);
  if (ipNum === null) {
    return { error: `Invalid IPv4 address '${ipPart}'. Expected 4 octets (0-255) separated by dots.` };
  }

  // Calculate subnet mask
  const maskNum = cidrPart === 0 ? 0 : ((0xffffffff << (32 - cidrPart)) >>> 0);
  const wildcardNum = (~maskNum) >>> 0;

  // Network and broadcast
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  // Hosts calculation
  let totalHosts = Math.pow(2, 32 - cidrPart);
  let usableHosts = 0;
  let firstUsableNum = 0;
  let lastUsableNum = 0;

  if (cidrPart === 32) {
    usableHosts = 1;
    firstUsableNum = networkNum;
    lastUsableNum = networkNum;
  } else if (cidrPart === 31) {
    // RFC 3021 Point-to-Point
    usableHosts = 2;
    firstUsableNum = networkNum;
    lastUsableNum = broadcastNum;
  } else {
    usableHosts = totalHosts - 2;
    firstUsableNum = (networkNum + 1) >>> 0;
    lastUsableNum = (broadcastNum - 1) >>> 0;
  }

  const firstOctet = parseInt(ipPart.split(".")[0], 10);

  return {
    success: true,
    input: `${ipPart}/${cidrPart}`,
    ipAddress: ipPart,
    cidr: `/${cidrPart}`,
    cidrNum: cidrPart,
    subnetMask: intToIp(maskNum),
    wildcardMask: intToIp(wildcardNum),
    networkAddress: intToIp(networkNum),
    broadcastAddress: intToIp(broadcastNum),
    firstUsableIp: intToIp(firstUsableNum),
    lastUsableIp: intToIp(lastUsableNum),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
    usableHostsRaw: usableHosts,
    ipClass: getIpClass(firstOctet),
    ipScope: getIpScope(ipPart),
    binarySubnetMask: intToBinaryString(maskNum),
    binaryIp: intToBinaryString(ipNum),
  };
}

// Inspect any individual IP address
export function inspectIp(ipStr) {
  if (!ipStr) return { error: "Please enter an IPv4 address (e.g. 202.70.72.1)" };
  const trimmed = ipStr.trim();
  const ipNum = ipToInt(trimmed);
  if (ipNum === null) {
    return { error: "Invalid IPv4 address format. Must be 4 numbers between 0 and 255." };
  }

  const parts = trimmed.split(".").map(Number);
  const [o1, o2, o3, o4] = parts;

  // Reverse DNS PTR pointer name
  const reversePtr = `${o4}.${o3}.${o2}.${o1}.in-addr.arpa`;

  // Standard Nepal context information
  let contextNote = "Standard Global IP";
  if (trimmed.startsWith("202.70.") || trimmed.startsWith("202.51.")) {
    contextNote = "Nepal Telecom (NTC) IP Range";
  } else if (trimmed.startsWith("103.10.") || trimmed.startsWith("110.44.")) {
    contextNote = "WorldLink Communications Nepal IP Range";
  } else if (trimmed.startsWith("103.247.") || trimmed.startsWith("27.111.")) {
    contextNote = "Vianet Communications Nepal IP Range";
  } else if (trimmed.startsWith("192.168.1.") || trimmed.startsWith("192.168.0.")) {
    contextNote = "Typical Nepal Home/SME Wi-Fi Gateway Subnet";
  } else if (trimmed.startsWith("192.168.88.")) {
    contextNote = "Default MikroTik RouterOS Gateway Subnet (Common in Nepal ISPs)";
  } else if (trimmed.startsWith("192.168.100.")) {
    contextNote = "Default Huawei/Nokia GPON Optical Fiber ONU Subnet (Nepal)";
  } else if (trimmed === "8.8.8.8" || trimmed === "8.8.4.4") {
    contextNote = "Google Public Anycast DNS";
  } else if (trimmed === "1.1.1.1" || trimmed === "1.0.0.1") {
    contextNote = "Cloudflare High-Performance DNS";
  }

  return {
    success: true,
    ipAddress: trimmed,
    ipClass: getIpClass(o1),
    ipScope: getIpScope(trimmed),
    integerRepresentation: ipNum,
    hexRepresentation: `0x${ipNum.toString(16).toUpperCase().padStart(8, "0")}`,
    binaryRepresentation: intToBinaryString(ipNum),
    reversePtr: reversePtr,
    contextNote: contextNote,
  };
}
