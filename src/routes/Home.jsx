import { styled } from "baseui";
import { Button } from "baseui/button";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Centered from "../commons/Centered";

import { data as expansionList } from "../data/expansions.json";

const ButtonsLayout = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: ".5em",
});

function Home() {
  return (
    <Fragment>
      <Centered>
        <ButtonsLayout>
          {expansionList.map((expansion) => (
            <Link to={`/${expansion.id}/`} key={expansion.id}>
              <Button>
                {expansion.patch}
                <br />
                {expansion.name}
              </Button>
            </Link>
          ))}
        </ButtonsLayout>
      </Centered>
    </Fragment>
  );
}

export default Home;
