import { Box, Paper } from "@mui/material";
const Chat = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: { xs: 4, sm: 4 },
          width: "100%",
          background: "white",
          position: "relative",
        }}
      >
        {/* <List sx={{ pt: loading ? 0 : 0 }}>
          {filteredUsers.length === 0 && !loading && (
            <Typography
              variant="body2"
              sx={{ color: "#888", textAlign: "center", mt: 2 }}
            >
              No nearby users found.
            </Typography>
          )}
          {filteredUsers.map((u) => (
            <ListItem
              key={u.uid}
              sx={{ mb: 1 }}
              onClick={() => handlePersonClick(u)}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    u.profilePicture ||
                    "https://randomuser.me/api/portraits/lego/1.jpg"
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    sx={{ fontWeight: "bold", color: "#232526" }}
                    component="span"
                  >
                    {u.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      component={"span"}
                    >
                      @{u.username}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List> */}
      </Paper>
    </Box>
  );
};

export default Chat;
