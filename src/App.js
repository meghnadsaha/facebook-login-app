// src/App.js
import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageInsights, setPageInsights] = useState(null);

  const responseFacebook = (response) => {
    setUserData(response);
    fetchPages(response.accessToken);
  };
//https://chatgpt.com/share/59cf8ded-d986-40bf-a62f-c4e9a382b705
  const fetchPages = async (token) => {
    try {
      // console.log(`https://graph.facebook.com/me/accounts?access_token=${token}`);

      const res = await axios.get(
        `https://graph.facebook.com/me/accounts?access_token=${token}`
      );
      setPages(res.data.data);
    } catch (error) {
      alert("Error fetching pages:", error);
      console.error("Error fetching pages:", error);
      // Optionally, you can handle the error in the UI or show a message to the user
      setPages([]); // Clear pages if there's an error
    }
  };

  const fetchPageInsights = async (pageId, token) => {
    const since = "2024-01-01"; // example date
    const until = "2024-12-31"; // example date
    const period = "days_28";

    try {
      const res = await axios.get(
        `https://graph.facebook.com/${pageId}/insights?metric=page_fans,page_engaged_users,page_impressions,page_reactions&since=${since}&until=${until}&period=${period}&access_token=${token}`
      );
      setPageInsights(res.data.data);
    } catch (error) {
      alert(error)
      console.error("Error fetching page insights:", error);
    }
  };

  return (
    <div className="App">
      {!userData ? (
        <FacebookLogin
          appId="846560513488386"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,email,pages_show_list,pages_read_engagement"
          callback={responseFacebook}
        />
      ) : (
        <div>
          <h1>Welcome, {userData.name}</h1>
          <img src={userData.picture.data.url} alt="Profile" />
          <select
            onChange={(e) =>
              fetchPageInsights(e.target.value, userData.accessToken)
            }
          >
            <option value="">Select a Page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          {pageInsights && (
            <div>
              {pageInsights.map((insight) => (
                <div key={insight.name}>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                  <p>{insight.values[0].value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
