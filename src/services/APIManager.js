

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
const serverCreatorURL = process.env.NEXT_PUBLIC_CREATOR_URL;


const marketplace_url= "https://api.gryphon.finance/marketplace/"
const ai_url= "https://api.gryphon.finance/ai/"


// Marketplace API
export async function getNonce(publicAddress, chainId) {
  const data = {
    walletAddress: publicAddress,
    chainId: "2525"
  }
  const config = {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    
  };
  try {
    const url = `${marketplace_url}api/v1/creators/get-nounce`;
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let result = await response.json();
    console.log("getNonce result", result);
    return {
      data: result.data,
      message: result.message
    };
  } catch (err) {
    console.log(err, "error");
    return { success: false, message: err.message };
  }
};
export async function verifyUser(publicAddress, chainId, signature) {
  const data = {
    walletAddress: publicAddress,
    chainId: "2525",
    signature: signature
  }
  const config = {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    
  };
  try {
    const url = `${marketplace_url}api/v1/creators/verify-user-signature` ;
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let result = await response.json();
    console.log("verifyUser result", result);
    return {
      data: result.data,
      message: result.message
    };
  } catch (err) {
    console.log(err, "error");
    return { success: false, message: err.message };
  }
};
export async function getProfile(token) {

  try {
    const url = `${marketplace_url}api/v1/creators/profile`;
    const response = await fetch(url, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let result = await response.json();
    console.log("getProfile result", result);
    return {
      data: result.data,
      message: result.message,
      success: result.success
    };
  } catch (err) {
    console.log(err, "error");
    return { success: false, message: err.message };
  }
};


// AI API
export async function getAllAgents() {
  try {
    const response = await fetch(`${ai_url}api/v1/agents`, {
      method: 'GET',
      
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('All Agent data:', result);

    return {
      data: result.data,
      message: result.message,
      success: result.success
    };
  } catch (err) {
    console.log(err, "error");
    return { success: false, message: err.message };
  }
}

export async function getAgentById(agentId,token) {
  try {
    const response = await fetch(`${ai_url}api/v1/agents/${agentId}`, {
      method: 'GET',
      
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Agent data:', result);

    return {
      data: result.data,
      message: result.message,
      success: result.success
    };
  } catch (err) {
    console.log(err, "error");
    return { success: false, message: err.message };
  }
}

export async function createAgent(agentData, token) {


  try {
    const response = await fetch(`${ai_url}api/v1/agents`, {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(agentData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Agent Created:", result);

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (err) {
    console.error("Error creating agent:", err);
    return { success: false, message: err.message };
  }
}

