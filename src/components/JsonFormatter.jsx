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
import { BsFolder2Open } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

const JsonFormatter = () => {
  const [inputValue, setInputValue] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [shouldFixErrors, setShouldFixErrors] = useState(true);
  const [jsonTem , setJsonTem] = useState("Compact")
  const [jsonSpec , setJsonSpec] = useState("RFC 8259")


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
    } else if (shouldFixErrors) {
      fixAndParseJson();
    } else {
      parseJson();
    }
  };

  const fixAndParseJson = () => {
    try {
      const fixedJson = JSON.parse(
        JSON.stringify(
          inputValue.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '),
          null,
          2
        )
      );
      setFormattedJson(fixedJson);
    } catch (error) {
      setFormattedJson(error.message);
    }
  };

  const parseJson = () => {
    try {
      const parsedJson = JSON.parse(inputValue);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setFormattedJson(formatted);
    } catch (error) {
      setFormattedJson(error.message);
    }
  };

  const fetchJsonFromUrl = async () => {
    try {
      const response = await fetch(inputValue);
      const json = await response.json();
      const formatted = JSON.stringify(json, null, 2);
      setFormattedJson(formatted);
    } catch (error) {
      setFormattedJson(error.message);
    }
  };

  const loadRandomJson = () => {
    // Replace this with your own logic to load random JSON
    const randomJson = { example: "Random JSON" };
    const formatted = JSON.stringify(randomJson, null, 2);
    setFormattedJson(formatted);
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
      <VStack >
      <Menu>
        <label>Json Template</label>
          <MenuButton as={Button} colorScheme="blue"  >
           {jsonTem}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={()=>setJsonTem("4 Spaces tab")}>4 Spaces tab</MenuItem>
            <MenuItem onClick={()=>setJsonTem("3 Spaces tab")}>3 Spaces tab</MenuItem>
            <MenuItem onClick={()=>setJsonTem("2 Spaces tab")}>2 Spaces tab</MenuItem>
            <MenuItem onClick={()=>setJsonTem("1 Spaces tab")}>1 Spaces tab</MenuItem>
            <MenuItem onClick={()=>setJsonTem("Compact")}>Compact</MenuItem>
            
          </MenuList>
        </Menu>
        <Menu>
        <label>Json Spec</label>
        <MenuButton as={Button} colorScheme="blue"  >
           {jsonSpec}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={()=>setJsonSpec("RFC 8259")}>RFC 8259</MenuItem>
            <MenuItem onClick={()=>setJsonSpec("RFC 7159")}>RFC 7159</MenuItem>
            <MenuItem onClick={()=>setJsonSpec("RFC 4627")}>RFC 4627</MenuItem>
            <MenuItem onClick={()=>setJsonSpec("Skip")}>Skip</MenuItem>
            
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
        <Code whiteSpace="pre">{formattedJson}</Code>
      </Box>
    </Stack>
  );
};

export default JsonFormatter;
