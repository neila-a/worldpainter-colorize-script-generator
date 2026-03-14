import {
    type RGB
} from "@ctrl/tinycolor/dist/interfaces";
import Download from "@mui/icons-material/Download";
import FileOpen from "@mui/icons-material/FileOpen";
import Restore from "@mui/icons-material/Restore";
import Save from "@mui/icons-material/Save";
import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import fileDownload from "js-file-download";
import {
    createTheme,
    ThemeProvider
} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
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
// @ts-expect-error raw import by vite
import colorizer from "../../script/dist/index.cjs?raw"; // Must directly write the path because it isn't a module.
import allPossibleBlocks from "./data/allPossibleBlocks";
import defaultPalette, {
    palette
} from "./data/defaultPalette";

const drawerWidth = 250,
    white = {
        r: 255,
        g: 255,
        b: 255
    } as RGB;

export interface colorizerDefines {
    allPossibleBlocks: string[];
    /**  
     * @type Array<"block r g b">
     */
    def: string[];
}

export default function App() {
    const [palette, setPalette] = useState<palette>(defaultPalette),
        [searching, setSearching] = useState("");
    return <>
        <Box sx={{
            marginRight: `${drawerWidth}px` // must use px or it will be (drawerWidth * 8)px
        }}>
            <Box sx={theme => ({
                p: 1,
                position: "sticky",
                top: 0,
                zIndex: theme.zIndex.modal - 1,
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
                    return <ThemeProvider theme={createTheme({
                        palette: {
                            primary: {
                                main: `rgb(${color.r}, ${color.g}, ${color.b})`
                            }
                        }
                    })}>
                        <ListItem key={id} sx={theme => ({
                            p: 1,
                            minHeight: theme.spacing(7 + 2), // MuiColorInput height = 7 * 8px
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText
                        })} secondaryAction={<Box sx={{
                            display: "flex"
                        }}>
                            <MuiColorInput value={color} onChange={RGBstring => {
                                const colors = RGBstring.replace("rgb(", "").replace(")", "").split(", ");
                                setPalette(oldPalette => ({
                                    ...oldPalette,
                                    [id]: {
                                        r: colors[0],
                                        g: colors[1],
                                        b: colors[2]
                                    }
                                }));
                            }} />
                            <IconButton onClick={() => setPalette(oldPalette => Object.fromEntries(
                                Object.entries(oldPalette).filter(([blockID]) => blockID !== id)
                            ))}>
                                <Restore />
                            </IconButton>
                        </Box>}>
                            <ListItemText primary={id} secondary={inPalette ? <Fragment /> : "未指定"} />
                        </ListItem>
                    </ThemeProvider>;
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
                p: 1
            }}>
                <Typography variant="h4">
                    已选择
                </Typography>
                <Typography>
                    {Object.keys(palette).length}个方块
                </Typography>
            </Box>
            <Box sx={{
                bottom: 0,
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
                            .replaceAll("defines", JSON.stringify({
                                allPossibleBlocks,
                                def: Object.entries(palette).map(([id, color]) => [
                                    id,
                                    color.r,
                                    color.g,
                                    color.b
                                ].join(" "))
                            } as colorizerDefines))
                            .replace("\"use strict\";", ""),
                        "colorizer.js"
                    )}>
                        导出脚本
                    </Button>
                </ButtonGroup>
            </Box>
        </Drawer>
    </>;
};
