import { Container } from "@mui/material";
import SearchBar from "./searchbar/SearchBar";
import Fabs from "./fabs/Fabs";

export default function Controls() {
    return (
        <Container>
            <SearchBar />
            <Fabs />
        </Container>
    );
}