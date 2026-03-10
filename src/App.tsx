import Add from "@mui/icons-material/Add";
import Download from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import {
    useState
} from "react";
import {
    RgbColorPicker,
    type RgbColor
} from "react-colorful";
import defaultPalette from "./defaultPalette.json";
import allPossibleBlocks from "./allPossibleBlocks.json";
import colorizer from "./colorizer.js?raw";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import FileOpen from "@mui/icons-material/FileOpen";
import Save from "@mui/icons-material/Save";
import fileDownload from "js-file-download";
import {
    pickFile
// @ts-expect-error js-pick-file don't have types or DefinitelyTyped.
} from "js-pick-file";

/**
 * It is an object because sometimes we need to change its ID without changing its color.
 */
interface block {
    id: string;
    color: RgbColor;
};

const drawerWidth = 250;

export default function App() {
    const [blocks, setBlocks] = useState<block[]>(defaultPalette);
    return <>
        <Grid container sx={{
            p: 1,
            paddingRight: `${drawerWidth}px` // must use px or it will be dp
        }} rowSpacing={2} columnSpacing={2}>
            {blocks.map((block, index) => <Grid>
                <Paper sx={{
                    p: 1
                }} elevation={3}>
                    <FormControl fullWidth sx={{
                        marginBottom: 1
                    }}>
                        <InputLabel id="id-select-label">
                            ID
                        </InputLabel>
                        <Select labelId="id-select-label" label="ID" onChange={event => setBlocks(oldBlocks => {
                            const buffer = oldBlocks.slice();
                            buffer[index].id = event.target.value;
                            return buffer;
                        })} id="id-select" value={block.id}>
                            {allPossibleBlocks.map(possibleBlock => <MenuItem value={possibleBlock}>
                                {possibleBlock}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                    <RgbColorPicker color={block.color} onChange={newColor => setBlocks(oldBlocks => {
                        const buffer = oldBlocks.slice();
                        buffer[index].color = newColor;
                        return buffer;
                    })} />
                    <IconButton aria-label="delete" color="error" onClick={() => setBlocks(oldBlocks => {
                        const buffer = oldBlocks.slice();
                        buffer.splice(index, 1);
                        return buffer;
                    })}>
                        <Delete />
                    </IconButton>
                </Paper>
            </Grid>)}
        </Grid>
        <Fab sx={{
            position: "fixed",
            bottom: 16,
            right: 16 + 250
        }} color="primary" onClick={() => setBlocks([...blocks, {
            id: "Custom1",
            color: {
                r: 57,
                g: 56,
                b: 63
            }
        }])}>
            <Add />
        </Fab>
        <Drawer sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: 250,
                boxSizing: "border-box"
            }
        }} variant="permanent" anchor="right">
            <Box sx={{
                bottom: "0",
                position: "fixed",
                p: 1
            }}>
                <ButtonGroup variant="outlined" fullWidth sx={{
                    marginBottom: 1
                }}>
                    <Button startIcon={<FileOpen />} onClick={() => (pickFile({
                        accept: ".json",
                        multiple: false
                    }) as Promise<FileList>).then(list => list[0].text()).then(json => setBlocks(JSON.parse(json)))}>
                        加载调色板
                    </Button>
                    <Button startIcon={<Save />} onClick={() => fileDownload(
                        JSON.stringify(blocks),
                        "palette.json"
                    )}>
                        保存调色板
                    </Button>
                </ButtonGroup>
                <ButtonGroup variant="contained" fullWidth>
                    <Button startIcon={<Download />} onClick={() => fileDownload(
                        colorizer
                            .replace("_def_", JSON.stringify(blocks.map(block => [
                                block.id,
                                block.color.r,
                                block.color.g,
                                block.color.b
                            ].join(" "))))
                            .replace("_allPossibleBlocks_", JSON.stringify(allPossibleBlocks)),
                        "colorizer.js"
                    )}>
                        导出脚本
                    </Button>
                </ButtonGroup>
            </Box>
        </Drawer>
    </>;
};
