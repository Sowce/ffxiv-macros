import { styled } from "baseui";
import { Button } from "baseui/button";
import { useNavigate, useParams } from "react-router-dom";
import TextHeader from "../commons/TextHeader";

import { data as expansionList } from "../data/expansions.json";
import { data as raidList } from "../data/raids.json";

function RaidList() {
  const params = useParams();
  const navigate = useNavigate();

  const expansion = expansionList.find(
    (expansion) =>
      expansion.id.toLowerCase() === params.expansionID.toLowerCase()
  );

  if (!expansion) navigate("/404");

  const raid = raidList.find((raid) => raid.level === expansion.level);

  if (!raid) navigate("/404");

  const PageContainer = styled("div", {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    rowGap: ".5em",
    height: "100vh",
  });

  const TiersLayout = styled("div", {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
    rowGap: "1em",
  });

  const RaidTier = styled("div", {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "1em",
  });
  const RaidTierName = styled("div", {});
  const RaidTierDuty = styled("div", {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
  });

  return (
    <PageContainer>
      <TextHeader text={`${expansion.name} / Raids`} />
      <TiersLayout>
        {new Array(raid.tiers).fill().map((_, i) => (
          <RaidTier key={raid.shortName}>
            <RaidTierName>{raid.tierNames[i]}</RaidTierName>
            {new Array(4).fill().map((_, y) => (
              <RaidTierDuty key={`${raid.shortName}${i * 4 + y}`}>
                <Button>{raid.dutyNames[i * 4 + y]}</Button>
              </RaidTierDuty>
            ))}
          </RaidTier>
        ))}
      </TiersLayout>
    </PageContainer>
  );
}

export default RaidList;
