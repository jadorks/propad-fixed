function shortedAddress(address, startLimit = 4, endLimit = 4) {
  const newString = `${address.substr(2, startLimit)}...${address.substr(
    -endLimit
  )}`;
  return `0x${newString.toUpperCase()}`;
}
export default shortedAddress;
