import {
    type RGB
} from "@ctrl/tinycolor/dist/interfaces";
import Download from "@mui/icons-material/Download";
import FileOpen from "@mui/icons-material/FileOpen";
import Save from "@mui/icons-material/Save";
import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import fileDownload from "js-file-download";
import {
    pickFile
    // @ts-expect-error js-pick-file don't have types or DefinitelyTyped.
} from "js-pick-file";
import {
    MuiColorInput
} from "mui-color-input";
import {
    Fragment,
    useState
} from "react";
import allPossibleBlocks from "./allPossibleBlocks.json";
import colorizer from "./colorizer.js?raw";
import defaultPalette from "./defaultPalette.json";

const drawerWidth = 250,
    white = {
        r: 255,
        g: 255,
        b: 255
    } as const;

export default function App() {
    const [palette, setPalette] = useState<Record<string, RGB>>(defaultPalette),
        [searching, setSearching] = useState("");
    return <>
        <Box sx={{
            marginRight: `${drawerWidth}px` // must use px or it will be dp
        }}>
            <Box sx={theme => ({
                p: 1,
                position: "sticky",
                top: 0,
                zIndex: 1300 - 1, // Dialog zIndex = 1300
                bgcolor: theme.palette.background.default
            })}>
                <TextField onChange={event => setSearching(event.target.value)} slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                }} label="搜索" placeholder="方块ID" variant="outlined" fullWidth id="outlined-basic" />
            </Box>
            <List>
                {allPossibleBlocks.filter(block => block.toLowerCase().includes(searching.toLowerCase())).map(id => {
                    const inPalette = Object.hasOwn(palette, id),
                        color = inPalette ? palette[id] : white;
                    return <ListItem key={id} sx={{
                        p: 1,
                        minHeight: 72, // MuiColorInput height = 56
                        bgcolor: `rgb(${color.r}, ${color.g}, ${color.b})`
                    }} secondaryAction={<MuiColorInput value={color} onChange={RGBstring => {
                        const colors = RGBstring.replace("rgb(", "").replace(")", "").split(", ");
                        setPalette(oldPalette => ({
                            ...oldPalette,
                            [id]: {
                                r: colors[0],
                                g: colors[1],
                                b: colors[2]
                            }
                        }));
                    }} />}>
                        <ListItemText primary={id} secondary={inPalette ? <Fragment /> : "未指定"} />
                    </ListItem>;
                })}
            </List>
        </Box>
        <Drawer sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: drawerWidth,
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
                    }) as Promise<FileList>).then(list => list[0].text()).then(json => setPalette(JSON.parse(json)))}>
                        加载调色板
                    </Button>
                    <Button startIcon={<Save />} onClick={() => fileDownload(
                        JSON.stringify(palette),
                        "palette.json"
                    )}>
                        保存调色板
                    </Button>
                </ButtonGroup>
                <ButtonGroup variant="contained" fullWidth>
                    <Button startIcon={<Download />} onClick={() => fileDownload(
                        colorizer
                            .replace("_def_", JSON.stringify(Object.entries(palette).map(([id, color]) => [
                                id,
                                color.r,
                                color.g,
                                color.b
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
