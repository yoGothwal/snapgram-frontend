import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const Connections = () => {
  const token = useSelector((state) => state.user.token);
  const { username } = useParams();

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const fetchConnections = async () => {
    const res = await axios.get(`${baseURL}/api/connections/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { followers, followings } = res.data;
    console.log(followers);
    console.log(followings);
    setFollowers(followers);
    setFollowings(followings);
  };
  useEffect(() => {
    fetchConnections();
  }, [username]);
  return (
    <div style={{ display: "flex", marginTop: "10px", gap: "100px" }}>
      <div>
        <h1>Followers</h1>
        <div>
          {followers?.map((n) => (
            <p key={n._id}>
              <b>{n.name}</b>
              <i>{n.username}</i>
            </p>
          ))}
        </div>
      </div>
      <div>
        <h1>Followings</h1>
        <div>
          {followings?.map((n) => (
            <p key={n._id}>
              <b>{n.name}</b>
              <i>{n.username}</i>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
