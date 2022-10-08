import { styled } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { ArrowRight, Delete, Filter, Plus } from "baseui/icon";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { toaster, ToasterContainer } from "baseui/toast";
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

const macroEditorOverrides = {
  Input: {
    style: () => ({
      fontFamily: "Noto Sans, Myriad Pro, FFXIV", // ＭＳ Ｐゴシック,
      fontSize: "16px",
      lineHeight: "18.5px",
      overflowX: "normal",
      whiteSpace: "pre",
      overflowWrap: "normal",
      width: "30vw",
      height: "70vh",
    }),
  },
};

const SidePanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "20%",
});

const RuleBook = styled("div", {
  display: "flex",
  flexDirection: "column",
  overflowY: "scroll",
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
    else setRules([{ target: "M1", replacement: "" }]);

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

  macroEditorRef.current?.addEventListener("scroll", () => {
    macroPreviewRef.current.scrollTop = macroEditorRef.current.scrollTop;
  });

  const renderNewMacro = () => {
    let newMacro = macroCtn;

    // remove party text
    newMacro = newMacro.replace(
      /^(\[[0-9]{2}:[0-9]{2}\])?\(. [A-z'\-]+ [A-z'\-]+\) /gim,
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

  const CopyNewMacro = () => {
    macroPreviewRef.current.select();
    document.execCommand("copy");
    toaster.positive(<>Macro saved to clipboard.</>);
  };

  return (
    <Fragment>
      <ToasterContainer autoHideDuration={2500} closeable={false}>
        <Centered style={{ justifyContent: "space-evenly" }}>
          <Centered
            style={{
              overflowY: "scroll",
              flexDirection: "row",
            }}
          >
            <div style={{ position: "relative" }}>
              <Textarea
                inputRef={macroEditorRef}
                value={macroCtn}
                onChange={(e) => setMacroCtn(e.target.value)}
                overrides={macroEditorOverrides}
              />
            </div>
            <ArrowRight size={64} color="#ffffff" />
            <div style={{ position: "relative" }}>
              <Textarea
                readOnly
                value={renderNewMacro()}
                inputRef={macroPreviewRef}
                overrides={macroEditorOverrides}
              />
              <Button
                style={{
                  position: "absolute",
                  bottom: ".75em",
                  right: ".75em",
                }}
                onClick={CopyNewMacro}
              >
                Copy
              </Button>
            </div>
          </Centered>
          <SidePanel>
            <HeadingLevel>
              <Heading>
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
            <RuleBook ref={ruleBookRef}>
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
