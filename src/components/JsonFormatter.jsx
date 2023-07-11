import { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Code,
  Heading,
  Container,
  Checkbox,
  Stack,
  Input,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsClipboard2Check, BsFolder2Open } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import JsonFormatter from "react-json-formatter";
import { jsonrepair } from "jsonrepair";
import copy from "copy-to-clipboard";
import { PiClipboardTextBold } from "react-icons/pi";
const JsonFormatterFile = () => {
  const [inputValue, setInputValue] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [shouldFixErrors, setShouldFixErrors] = useState(true);
  const [jsonTem, setJsonTem] = useState(0);
  const [jsonSpec, setJsonSpec] = useState("RFC 8259");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      setInputValue(contents);
    };

    reader.readAsText(file);
  };

  const handleButtonOnClick = () => {
    if (isUrl(inputValue)) {
      fetchJsonFromUrl();
    }

    if (shouldFixErrors) {
      try {
        const repaired = jsonrepair(inputValue);
        setFormattedJson(repaired);
      } catch (error) {
        setFormattedJson(error.message);
      }
    } else {
      try {
        setFormattedJson(JSON.parse(inputValue));
      } catch (error) {
        setFormattedJson(error.message);
      }
    }
  };

  const fetchJsonFromUrl = async () => {
    try {
      const response = await fetch(inputValue);
      const json = await response.json();
      setFormattedJson(json);
    } catch (error) {
      setFormattedJson(error.message);
    }
  };

  const loadRandomJson = () => {
    const randomJson = { example: "Random JSON" };
    const formatted = JSON.stringify(randomJson);
    setInputValue(formatted);
  };

  const isUrl = (input) => {
    try {
      new URL(input);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Stack justifyContent={"center"} minH={"97vh"} alignItems={"center"}>
      <Heading as="h1" size="xl" mb={4} textAlign={"center"}>
        JSON Formatter
      </Heading>
      <Stack width={"fit-content"} direction={"row-reverse"} gap={5}>
        <VStack justifyContent={"center"}>
          <VStack>
            <Menu>
              <label>Json Template</label>
              <MenuButton as={Button} colorScheme="blue">
                {jsonTem === 0 ? "Compact" : jsonTem + "Tabs Spaces"}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setJsonTem(4)}>4 Spaces tab</MenuItem>
                <MenuItem onClick={() => setJsonTem(3)}>3 Spaces tab</MenuItem>
                <MenuItem onClick={() => setJsonTem(2)}>2 Spaces tab</MenuItem>
                <MenuItem onClick={() => setJsonTem(1)}>1 Spaces tab</MenuItem>
                <MenuItem onClick={() => setJsonTem(0)}>Compact</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <label>Json Spec</label>
              <MenuButton as={Button} colorScheme="blue">
                {jsonSpec}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setJsonSpec("RFC 8259")}>
                  RFC 8259
                </MenuItem>
                <MenuItem onClick={() => setJsonSpec("RFC 7159")}>
                  RFC 7159
                </MenuItem>
                <MenuItem onClick={() => setJsonSpec("RFC 4627")}>
                  RFC 4627
                </MenuItem>
                <MenuItem onClick={() => setJsonSpec("Skip")}>Skip</MenuItem>
              </MenuList>
            </Menu>
          </VStack>
          <Checkbox
            isChecked={shouldFixErrors}
            onChange={(e) => setShouldFixErrors(e.target.checked)}
          >
            Fix JSON Errors
          </Checkbox>
        </VStack>

        <Box>
          <Button m={5} colorScheme="blue" onClick={loadRandomJson}>
            Load Random JSON
          </Button>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            border={"2px"}
            p={5}
            borderRadius={10}
            alignItems={"flex-end"}
          >
            <Textarea
              rows={10}
              cols={80}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter JSON or URL..."
              variant={"unstyled"}
              resize={"none"}
            />
            <Box>
              <Input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileChange}
                id="file-input"
              />
              <label htmlFor="file-input">
                <IconButton
                  as="span"
                  cursor={"pointer"}
                  color="blue.400"
                  borderRadius={"full"}
                  variant={"unstyled"}
                  p={3}
                >
                  <BsFolder2Open />
                </IconButton>
              </label>
              <IconButton
                as="span"
                cursor={"pointer"}
                color="blue.400"
                borderRadius={"full"}
                variant={"unstyled"}
                p={3}
                onClick={() => setInputValue("")}
              >
                <MdDeleteOutline />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Stack>
      <Box mx={"auto"}>
        <Button colorScheme="blue" onClick={handleButtonOnClick}>
          Process
        </Button>
      </Box>
      {formattedJson && (
        <Code width={"lg"}>
          <Box width={"100%"} display={"flex"} justifyContent={"flex-end"}>
            <IconButton
              onClick={() => {
                copy(formattedJson), setCopied(true);
              }}
              color={"blue.400"}
              variant={"unstyled"}
            >
              {copied ? <BsClipboard2Check /> : <PiClipboardTextBold />}
            </IconButton>
          </Box>
          <JsonFormatter
            json={formattedJson}
            tabWith={jsonTem}
            jsonStyle={{
              propertyStyle: { color: "red" },
              stringStyle: { color: "green" },
              numberStyle: { color: "darkorange" },
            }}
          />
        </Code>
      )}
    </Stack>
  );
};

export default JsonFormatterFile;
