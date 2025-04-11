export const getEllipsisTxt = (str, n = 6) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };
  export const getFormTxt = (str, n = 6) => {
    if (str) {
      return `${str.slice(0, n)}***${str.slice(str.length - n)}`;
    }
    return "";
  };
  
  export const truncateString = (str, maxLength = 15) => {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  }
  