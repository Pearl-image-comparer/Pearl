import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  // TODO: Properly good to separate styling to it's own file
  const paperStyle = {
    p: "0.1rem 0.2rem 0.1rem 0.6rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    position: "absolute",
    top: "0.7rem",
    left: "0.7rem",
    right: "0.7rem",
  };

  const inputBaseStyle = {
    ml: 1,
    flex: 1,
  };

  return (
    <Paper sx={paperStyle}>
      <InputBase style={inputBaseStyle} placeholder="Search for a place" />
      <IconButton type="button">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
