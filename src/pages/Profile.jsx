const Profile = ({ user, place }) => {
  console.log("user", user);
  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <>
          <img
            src={user.profilePicture}
            alt="Profile"
            width={80}
            referrerPolicy="no-referrer"
          />
          <p>Name: {user.name}</p>
          <p>Bio: {user.bio}</p>
          <p>Username: {user.username}</p>
          <p>
            Location Coords: {user.coords.lng},{user.coords.lat},
          </p>
          <p>Place: {place}</p>
        </>
      )}
    </div>
  );
};
export default Profile;
