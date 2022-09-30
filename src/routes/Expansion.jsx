import { styled } from "baseui";
import { Button } from "baseui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import Centered from "../commons/Centered";
import TextHeader from "../commons/TextHeader";

import { data as dutyTypes } from "../data/dutyTypes.json";
import { data as expansionList } from "../data/expansions.json";

function Expansion() {
  const params = useParams();
  const navigate = useNavigate();

  const expansion = expansionList.find(
    (expansion) =>
      expansion.id.toLowerCase() === params.expansionID.toLowerCase()
  );

  if (!expansion)
    return (
      <Centered>
        <div style={{ textAlign: "center", lineHeight: "3em" }}>
          Couldn't find the expansion you asked for.
          <br />
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </Centered>
    );

  const DutyTypesContainer = styled("div", {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1em",
  });

  return (
    <Centered>
      <div>
        <TextHeader text={expansion.name} />
        <DutyTypesContainer>
          {dutyTypes.map((dutyType) => (
            <Link
              to={`/${params.expansionID}/${dutyType.id}s/`}
              key={`${params.expansionID}.${dutyType.id}`}
            >
              <Button>{dutyType.name}</Button>
            </Link>
          ))}
        </DutyTypesContainer>
      </div>
    </Centered>
  );
}

export default Expansion;
