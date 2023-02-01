import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Check, Delete, Filter, Plus } from "baseui/icon";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { toaster, ToasterContainer } from "baseui/toast";
import memoizeOne from "memoize-one";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Centered from "../commons/Centered";

const rulePresetsBase = [
  {
    id: "eastern-roles",
    name: "Roles (Eastern Style)",
    rules: [
      { target: "M1", replacement: "" },
      { target: "M2", replacement: "" },
      { target: "R1", replacement: "" },
      { target: "R2", replacement: "" },
      { target: "MT", replacement: "" },
      { target: "OT", replacement: "" },
      { target: "H1", replacement: "" },
      { target: "H2", replacement: "" },
    ],
  },
  {
    id: "jp-roles",
    name: "Roles (JP Style)",
    rules: [
      { target: "D1", replacement: "" },
      { target: "D2", replacement: "" },
      { target: "D3", replacement: "" },
      { target: "D4", replacement: "" },
      { target: "MT", replacement: "" },
      { target: "ST", replacement: "" },
      { target: "H1", replacement: "" },
      { target: "H2", replacement: "" },
    ],
  },
  {
    id: "light-parties",
    name: "Light Parties",
    rules: [
      { target: "G1", replacement: "" },
      { target: "G2", replacement: "" },
    ],
  },
];

const SpecialChracterButton = (props) => {
  const ingameFontButtonStyle = {
    fontFamily: "FFXIV, Noto Sans, Myriad Pro", // ＭＳ Ｐゴシック,
    fontSize: "12px",
  };

  const clicked = () => {
    const macroEditorRef = props.macroEditorRef.current;

    if (props.macroCtn.length === 0) {
      props.setMacroCtn(String.fromCharCode(props.charCode));
      macroEditorRef.focus();
      return;
    }

    const prevSelectionStart = macroEditorRef.selectionStart + 0;
    props.setMacroCtn(
      props.macroCtn.slice(0, macroEditorRef.selectionStart) +
        String.fromCharCode(props.charCode) +
        props.macroCtn.slice(macroEditorRef.selectionEnd, props.macroCtn.length)
    );
    macroEditorRef.focus();
    macroEditorRef.setSelectionRange(prevSelectionStart, prevSelectionStart);
  };

  return (
    <Button
      onClick={clicked}
      shape={SHAPE.circle}
      style={ingameFontButtonStyle}
      size={SIZE.mini}
    >
      {String.fromCharCode(props.charCode)}
    </Button>
  );
};

const CharWidget = ({
  from,
  length,
  macroEditorRef,
  macroCtn,
  setMacroCtn,
}) => {
  const ButtonContainer = styled("div", {});

  return (
    <ButtonContainer>
      {new Array(length).fill().map((_, i) => (
        <SpecialChracterButton
          charCode={from + i}
          macroEditorRef={macroEditorRef}
          macroCtn={macroCtn}
          setMacroCtn={setMacroCtn}
        />
      ))}
    </ButtonContainer>
  );
};

const MacroEditorContainer = styled("div", {
  position: "relative",
  padding: "0px 2.5px 5px 2.5px",
  padding: "1em 1em",
  boxSizing: "border-box",
  flexGrow: 1,
});

const macroEditorOverrides = {
  Root: { style: () => ({ height: "100%", borderRadius: "8px" }) },
  Input: {
    style: () => ({
      fontFamily: "Noto Sans, Myriad Pro, FFXIV", // ＭＳ Ｐゴシック,
      fontSize: "16px",
      lineHeight: "18.5px",
      overflowX: "normal",
      whiteSpace: "pre",
      overflowWrap: "normal",
      height: "100%",
    }),
    className: () => "fancyScroll",
  },
};

const SidePanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  minWidth: "20vw",
  width: "20vw",
  backgroundColor: "#202020",
  padding: "0em 1em",
});

const RuleBook = styled("div", {
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  padding: "0em .3em",
});
const RuleLine = styled("div", {
  display: "flex",
  marginBottom: ".5em",
  gap: ".5em",
});

function Macro() {
  {
    /* <CharWidget
          from={0xe0c0}
          length={7}
          macroEditorRef={macroEditorRef}
          macroCtn={macroCtn}
          setMacroCtn={setMacroCtn}
        /> */
  }
  const [macroCtn, setMacroCtn] = useState("");
  const [customRules, setCustomRules] = useState([]);
  const [rulePresets, setRulePresets] = useState([]);

  useEffect(() => {
    const savedRules = window.localStorage.getItem("rules");
    if (savedRules) setCustomRules(JSON.parse(savedRules));
    else setCustomRules([]);

    const macro = window.localStorage.getItem("macro");
    if (macro) setMacroCtn(macro);

    const savedRulePresets = window.localStorage.getItem("presets");
    if (savedRulePresets) {
      setRulePresets(
        rulePresetsBase.map((rulePreset) => ({
          ...rulePreset,
          used: savedRulePresets.includes(rulePreset.id),
        }))
      );
    } else {
      setRulePresets(
        rulePresetsBase.map((rulePreset) => ({
          ...rulePreset,
          used: false,
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (customRules.length < 1)
      return window.localStorage.setItem("rules", JSON.stringify([]));
    window.localStorage.setItem("rules", JSON.stringify(customRules));
  }, [customRules]);

  useEffect(() => {
    if (rulePresets.length < 1) return;
    window.localStorage.setItem(
      "presets",
      JSON.stringify(
        rulePresets
          .filter((rulePreset) => rulePreset.used)
          .map((rulePreset) => rulePreset.id)
      )
    );
  }, [rulePresets]);

  useEffect(() => {
    if (customRules.length < 1) return;
    window.localStorage.setItem("macro", macroCtn);
  }, [macroCtn]);

  const addNewRule = () => {
    setCustomRules([...customRules, { target: "", replacement: "" }]);
    setTimeout(() => {
      ruleBookRef.current.scrollTop = ruleBookRef.current.scrollHeight;
    }, 10);
  };

  const deleteRule = (index) => {
    if (customRules.length === 1) return setCustomRules([]);
    setCustomRules(customRules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  const updateRuleValue = (index, update) => {
    const newRules = [...customRules];
    newRules[index] = { ...newRules[index], ...update };
    setCustomRules(newRules);
  };

  const macroEditorRef = useRef();
  const macroPreviewRef = useRef();
  const ruleBookRef = useRef();

  const renderNewMacro = (macroCtn, customRules, rulePresets) => {
    let newMacro = macroCtn;

    // remove party text
    newMacro = newMacro.replace(
      /^(\[[0-9]{2}:[0-9]{2}\])?\(. ?[A-z'\-]+ [A-z'\-]+\) /gim,
      ""
    );
    // remove fc text
    newMacro = newMacro.replace(
      /^(\[[0-9]{2}:[0-9]{2}\])?\[[a-z0-9]+\]<.?[A-z'\-]+ [A-z'\-]+> /gim,
      ""
    );

    const customRulesCopy = [
      ...rulePresets
        .filter((rulePreset) => rulePreset.used)
        .map((rulePreset) => rulePreset.rules)
        .reduce(
          (accumulator, currentValue) => accumulator.concat(currentValue),
          []
        ),
      ...customRules,
    ];

    for (let rule of customRulesCopy) {
      newMacro = newMacro.replace(
        new RegExp(rule.target, "g"),
        rule.replacement
      );
    }

    return newMacro;
  };

  const memoRenderNewMacro = memoizeOne(renderNewMacro);

  const CopyNewMacro = (macroIndex) => {
    return () => {
      navigator.clipboard.writeText(
        macroPreviewRef.current.value
          .split(/\n/g)
          .slice(0 + 14 * macroIndex, 14 * (macroIndex + 1))
          .join("\n")
      );
      toaster.positive(<>Macro saved to clipboard.</>);
    };
  };

  macroEditorRef.current?.addEventListener("scroll", () => {
    macroPreviewRef.current.scrollTop = macroEditorRef.current.scrollTop;
  });

  macroPreviewRef.current?.addEventListener("wheel", (event) => {
    event.preventDefault();

    macroEditorRef.current.scroll({
      top: macroEditorRef.current.scrollTop + event.deltaY,
      behavior: "smooth",
    });
  });

  function toggleRulePreset(rulePresetID) {
    return function () {
      setRulePresets([
        ...rulePresets.map((rulePreset) =>
          rulePreset.id === rulePresetID
            ? { ...rulePreset, used: !rulePreset.used }
            : rulePreset
        ),
      ]);
    };
  }

  return (
    <Fragment>
      <ToasterContainer autoHideDuration={2500} closeable={false}>
        <Centered style={{ justifyContent: "space-evenly" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repear(2, 1fr)",
              gridTemplateRows: "1fr 8fr",
              flexGrow: 1,
              height: "100vh",
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 7%, rgba(20,20,20,1) 20%, rgba(20,20,20,1) 100%), url(https://salted.saltedxiv.com/uploads/2022/09/ffxiv_09022022_164425_564.jpg)",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                gridArea: "1 / 1 / 2 / 3",
                display: "flex",
                flexDirection: "column",
                padding: "0em 1em",
                boxSizing: "border-box",
                justifyContent: "end",
              }}
            >
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: "40px",
                  fontWeight: "500",
                  color: "white",
                  margin: "0px",
                  textShadow:
                    "0 0 10px rgba(20,20,20,1), 0px 0px 10px rgba(20,20,20,1)",
                }}
              >
                p8s hyper zoomer strat
              </p>
            </div>
            <MacroEditorContainer
              style={{ gridArea: "2 / 1 / 3 / 2", paddingRight: ".5em" }}
            >
              <Textarea
                className="fancyScroll"
                inputRef={macroEditorRef}
                value={macroCtn}
                onChange={(e) => setMacroCtn(e.target.value)}
                overrides={macroEditorOverrides}
              />
            </MacroEditorContainer>
            {/* <ArrowRight
                size={64}
                color="#ffffff"
                style={{
                  position: "absolute",
                  zIndex: "1",
                  transform: "translateX(-25px)",
                }}
              /> */}
            <MacroEditorContainer
              style={{ gridArea: "2 / 2 / 3 / 3", paddingLeft: ".5em" }}
            >
              <Textarea
                className="fancyScroll"
                readOnly
                value={memoRenderNewMacro(macroCtn, customRules, rulePresets)}
                inputRef={macroPreviewRef}
                overrides={macroEditorOverrides}
              />
            </MacroEditorContainer>
          </div>
          <SidePanel>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: ".5em",
                justifyContent: "center",
              }}
            >
              {new Array(
                Math.ceil(
                  memoRenderNewMacro(macroCtn, customRules, rulePresets)
                    .trim()
                    .match(/\n/gm)?.length / 15
                ) | 0
              )
                .fill()
                .map((_, i) => (
                  <Button
                    key={i}
                    onClick={CopyNewMacro(i)}
                    style={{ height: "2.5em", marginTop: "11px" }}
                    startEnhancer={() => <FontAwesomeIcon icon={faCopy} />}
                    title={`Copy Macro #${i + 1}`}
                  >
                    {i + 1}
                  </Button>
                ))}
            </div>
            <div
              style={{ borderBottom: "1px solid #333", padding: "0.5em 0em" }}
            ></div>
            <p
              style={{
                paddingLeft: ".5em",
                paddingRight: ".5em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgb(255,255,255)",
              }}
            >
              <Filter size={30} /> Rule Presets
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5em" }}>
              {rulePresets.map((rulePreset) => (
                <Button
                  isSelected={rulePreset.used}
                  onClick={toggleRulePreset(rulePreset.id)}
                  key={rulePreset.id}
                  title={`Replaces ${rulePreset.rules
                    .map((rule) => rule.target)
                    .join(", ")}`}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        flexGrow: "1",
                      }),
                    },
                  }}
                >
                  {rulePreset.used && (
                    <Check style={{ paddingRight: "1vmin" }} />
                  )}
                  {rulePreset.name}
                </Button>
              ))}
            </div>
            <div
              style={{ borderBottom: "1px solid #333", padding: "0.5em 0em" }}
            ></div>
            <p
              style={{
                paddingLeft: ".5em",
                paddingRight: ".5em",
                paddingTop: ".5em",
                paddingBottom: "0.3em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgb(255,255,255)",
              }}
            >
              <Filter size={30} /> Custom Rules ({customRules.length})
              <Button
                onClick={addNewRule}
                style={{
                  marginLeft: "1em",
                  position: "absolute",
                  right: "1em",
                }}
              >
                <Plus size={24} />
              </Button>
            </p>
            <RuleBook className="fancyScroll" ref={ruleBookRef}>
              {customRules.map((rule, ruleIndex) => (
                <RuleLine key={ruleIndex}>
                  <Input
                    value={rule.target}
                    onChange={(e) =>
                      updateRuleValue(ruleIndex, { target: e.target.value })
                    }
                    placeholder="Find"
                    overrides={{
                      Root: { style: () => ({ borderRadius: "8px" }) },
                    }}
                  ></Input>
                  <Input
                    value={rule.replacement}
                    onChange={(e) =>
                      updateRuleValue(ruleIndex, {
                        replacement: e.target.value,
                      })
                    }
                    overrides={{
                      Root: { style: () => ({ borderRadius: "8px" }) },
                    }}
                    placeholder="Replace"
                  ></Input>
                  <Button
                    onClick={() => deleteRule(ruleIndex)}
                    kind={KIND.secondary}
                    // style={{ borderRadius: 0 }}
                  >
                    <Delete />
                  </Button>
                </RuleLine>
              ))}
            </RuleBook>
          </SidePanel>
        </Centered>
      </ToasterContainer>
    </Fragment>
  );
}

export default Macro;
