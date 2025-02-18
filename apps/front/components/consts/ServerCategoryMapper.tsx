import ApartmentIcon from '@mui/icons-material/Apartment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CasinoIcon from '@mui/icons-material/Casino';
import CloudIcon from '@mui/icons-material/Cloud';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ExploreIcon from '@mui/icons-material/Explore';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagIcon from '@mui/icons-material/Flag';
import GroupIcon from '@mui/icons-material/Group';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HotelIcon from '@mui/icons-material/Hotel';
import IcecreamIcon from '@mui/icons-material/Icecream';
import ImageIcon from '@mui/icons-material/Image';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LockIcon from '@mui/icons-material/Lock';
import MapIcon from '@mui/icons-material/Map';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import SyncIcon from '@mui/icons-material/Sync';
import TerrainIcon from '@mui/icons-material/Terrain';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {ServerCategory} from '@shared/enums';
import React, {ReactNode} from 'react';

const ServerCategoryMapper: {
    [key in ServerCategory]: {icon: ReactNode; color: string};
} = {
    [ServerCategory.Bedrock]: {icon: <TerrainIcon />, color: '#7E7E7E'},
    [ServerCategory.Whitelist]: {icon: <VerifiedUserIcon />, color: '#A8DADC'},
    [ServerCategory.Survival]: {icon: <NaturePeopleIcon />, color: '#457B9D'},
    [ServerCategory.Classic]: {icon: <HistoryEduIcon />, color: '#F4A261'},
    [ServerCategory.Hardcore]: {icon: <WhatshotIcon />, color: '#E63946'},
    [ServerCategory.Adventure]: {icon: <ExploreIcon />, color: '#2A9D8F'},
    [ServerCategory.Vanilla]: {icon: <IcecreamIcon />, color: '#F1FAEE'},
    [ServerCategory.SemiVanilla]: {icon: <IcecreamIcon />, color: '#F1FAEE'},
    [ServerCategory.PvE]: {icon: <GroupIcon />, color: '#E9C46A'},
    [ServerCategory.PvP]: {icon: <SportsMmaIcon />, color: '#F4A261'},
    [ServerCategory.Roleplay]: {icon: <TheaterComedyIcon />, color: '#A8DADC'},
    [ServerCategory.Economy]: {icon: <AttachMoneyIcon />, color: '#2A9D8F'},
    [ServerCategory.Tekkit]: {icon: <CloudIcon />, color: '#457B9D'},
    [ServerCategory.Skyblock]: {icon: <CloudIcon />, color: '#A8DADC'},
    [ServerCategory.Factions]: {icon: <PeopleIcon />, color: '#E63946'},
    [ServerCategory.HungerGames]: {icon: <FastfoodIcon />, color: '#F4A261'},
    [ServerCategory.CaptureTheFlag]: {icon: <FlagIcon />, color: '#2A9D8F'},
    [ServerCategory.McMMO]: {icon: <SportsEsportsIcon />, color: '#F1FAEE'},
    [ServerCategory.FeedTheBeast]: {icon: <FastfoodIcon />, color: '#E9C46A'},
    [ServerCategory.LandClaim]: {icon: <MapIcon />, color: '#A8DADC'},
    [ServerCategory.LuckyBlock]: {icon: <CasinoIcon />, color: '#F4A261'},
    [ServerCategory.Towny]: {icon: <LocationCityIcon />, color: '#457B9D'},
    [ServerCategory.Parkour]: {icon: <DirectionsRunIcon />, color: '#E63946'},
    [ServerCategory.Skywars]: {icon: <CloudIcon />, color: '#2A9D8F'},
    [ServerCategory.Earth]: {icon: <PublicIcon />, color: '#A8DADC'},
    [ServerCategory.FamilyFriendly]: {
        icon: <FamilyRestroomIcon />,
        color: '#F1FAEE',
    },
    [ServerCategory.OneBlock]: {icon: <CropSquareIcon />, color: '#E9C46A'},
    [ServerCategory.Anarchy]: {icon: <WarningIcon />, color: '#F4A261'},
    [ServerCategory.CityBuild]: {icon: <ApartmentIcon />, color: '#457B9D'},
    [ServerCategory.MineZ]: {icon: <LocalHospitalIcon />, color: '#E63946'},
    [ServerCategory.Bedwars]: {icon: <HotelIcon />, color: '#2A9D8F'},
    [ServerCategory.LifeSteal]: {icon: <FavoriteIcon />, color: '#A8DADC'},
    [ServerCategory.Crossplay]: {icon: <SyncIcon />, color: '#F1FAEE'},
    [ServerCategory.Pixelmon]: {icon: <ImageIcon />, color: '#E9C46A'},
    [ServerCategory.Cobblemon]: {icon: <ImageIcon />, color: '#F4A261'},
    [ServerCategory.KitPvP]: {icon: <SportsMmaIcon />, color: '#457B9D'},
    [ServerCategory.SurvivalGames]: {icon: <SportsEsportsIcon />, color: '#E63946'},
    [ServerCategory.MiniGames]: {icon: <CasinoIcon />, color: '#2A9D8F'},
    [ServerCategory.Prison]: {icon: <LockIcon />, color: '#A8DADC'},
};

export default ServerCategoryMapper;
