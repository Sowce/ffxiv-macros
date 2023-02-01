import { styled } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { ArrowRight, Delete, Filter, Plus } from "baseui/icon";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { toaster, ToasterContainer } from "baseui/toast";
import memoizeOne from "memoize-one";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Centered from "../commons/Centered";

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
  height: "calc(100% - 5px)",
  flexGrow: 1,
});

const macroEditorOverrides = {
  Root: { style: () => ({ height: "100%" }) },
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
});

const RuleBook = styled("div", {
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});
const RuleLine = styled("div", { display: "flex", marginBottom: ".5em" });

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
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const savedRules = window.localStorage.getItem("rules");
    if (savedRules) setRules(JSON.parse(savedRules));
    else
      setRules([
        { target: "M1", replacement: "" },
        { target: "M2", replacement: "" },
        { target: "R1", replacement: "" },
        { target: "R2", replacement: "" },
        { target: "D1", replacement: "" },
        { target: "D2", replacement: "" },
        { target: "D3", replacement: "" },
        { target: "D4", replacement: "" },
        { target: "MT", replacement: "" },
        { target: "OT", replacement: "" },
        { target: "ST", replacement: "" },
        { target: "H1", replacement: "" },
        { target: "H2", replacement: "" },
        { target: "G1", replacement: "" },
        { target: "G2", replacement: "" },
      ]);

    const macro = window.localStorage.getItem("macro");
    if (macro) setMacroCtn(macro);
  }, []);

  useEffect(() => {
    if (rules.length < 1) return;
    window.localStorage.setItem("rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    if (rules.length < 1) return;
    window.localStorage.setItem("macro", macroCtn);
  }, [macroCtn]);

  const addNewRule = () => {
    setRules([...rules, { target: "", replacement: "" }]);
    setTimeout(() => {
      ruleBookRef.current.scrollTop = ruleBookRef.current.scrollHeight;
    }, 10);
  };

  const deleteRule = (index) => {
    setRules(rules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  const updateRuleValue = (index, update) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...update };
    setRules(newRules);
  };

  const macroEditorRef = useRef();
  const macroPreviewRef = useRef();
  const ruleBookRef = useRef();

  const renderNewMacro = (macroCtn, rules) => {
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

    for (let rule of rules) {
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
    console.log(event.deltaY);
    //   macroEditorRef.current.scroll();
  });

  return (
    <Fragment>
      <ToasterContainer autoHideDuration={2500} closeable={false}>
        <Centered style={{ justifyContent: "space-evenly" }}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              height: "100vh",
            }}
          >
            <HeadingLevel>
              <div
                style={{
                  display: "flex",
                  gap: ".5em",
                  flexDirection: "row",
                  paddingLeft: "1em",
                  width: "calc(100% - 2em)",
                  alignItems: "center",
                }}
              >
                <Heading>people will put dumb names here</Heading>
                {new Array(
                  Math.ceil(
                    memoRenderNewMacro(macroCtn, rules).trim().match(/\n/gm)
                      ?.length / 15
                  ) | 0
                )
                  .fill()
                  .map((_, i) => (
                    <Button
                      key={i}
                      onClick={CopyNewMacro(i)}
                      style={{ height: "2.5em", marginTop: "11px" }}
                    >
                      Copy Macro {i + 1}
                    </Button>
                  ))}
              </div>
            </HeadingLevel>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                flexGrow: 1,
                marginTop: "2.8px",
              }}
            >
              <MacroEditorContainer>
                <Textarea
                  className="fancyScroll"
                  inputRef={macroEditorRef}
                  value={macroCtn}
                  onChange={(e) => setMacroCtn(e.target.value)}
                  overrides={macroEditorOverrides}
                />
              </MacroEditorContainer>
              <ArrowRight
                size={64}
                color="#ffffff"
                style={{
                  position: "absolute",
                  zIndex: "1",
                  transform: "translateX(-25px)",
                }}
              />
              <MacroEditorContainer>
                <Textarea
                  className="fancyScroll"
                  readOnly
                  value={memoRenderNewMacro(macroCtn, rules)}
                  inputRef={macroPreviewRef}
                  overrides={macroEditorOverrides}
                />
              </MacroEditorContainer>
            </div>
          </div>
          <SidePanel>
            <HeadingLevel>
              <Heading style={{ paddingLeft: ".5em", paddingRight: ".5em" }}>
                <Filter size={25} /> Rules ({rules.length})
                <Button
                  shape="circle"
                  onClick={addNewRule}
                  style={{ marginLeft: "1em" }}
                >
                  <Plus size={24} />
                </Button>
              </Heading>
            </HeadingLevel>
            <RuleBook className="fancyScroll" ref={ruleBookRef}>
              {rules.map((rule, ruleIndex) => (
                <RuleLine key={ruleIndex}>
                  <Input
                    value={rule.target}
                    onChange={(e) =>
                      updateRuleValue(ruleIndex, { target: e.target.value })
                    }
                    placeholder="Find"
                  ></Input>
                  <Input
                    value={rule.replacement}
                    onChange={(e) =>
                      updateRuleValue(ruleIndex, {
                        replacement: e.target.value,
                      })
                    }
                    placeholder="Replace"
                  ></Input>
                  <Button
                    onClick={() => deleteRule(ruleIndex)}
                    kind={KIND.secondary}
                    style={{ borderRadius: 0 }}
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
