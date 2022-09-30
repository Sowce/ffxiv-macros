import { styled } from "baseui";
import { Button, SHAPE } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { ArrowLeft } from "baseui/icon";
import { useNavigate } from "react-router-dom";

function TextHeader(props) {
  const navigate = useNavigate();

  const HeaderContainer = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  });

  return (
    <HeaderContainer>
      <Button
        onClick={() => navigate(-1)}
        size="mini"
        shape={SHAPE.circle}
        style={{ marginTop: "3px", marginRight: "5px" }}
      >
        <ArrowLeft />
      </Button>
      <HeadingLevel>
        <Heading>{props.text}</Heading>
      </HeadingLevel>
    </HeaderContainer>
  );
}

export default TextHeader;
