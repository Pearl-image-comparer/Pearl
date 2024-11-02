import { IconButton, InputBase, Paper, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const StyledPaper = styled(Paper)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0.7rem",
    left: "0.7rem",
    right: "0.7rem",
    padding: "0.1rem 0.2rem 0.1rem 0.6rem",
    zIndex: 1000,
  });

  const StyledInputBase = styled(InputBase)({
    marginLeft: 1,
    flex: 1,
  });

  return (
    <StyledPaper>
      <StyledInputBase placeholder="Search for a place" />
      <IconButton type="button">
        <SearchIcon />
      </IconButton>
    </StyledPaper>
  );
}
