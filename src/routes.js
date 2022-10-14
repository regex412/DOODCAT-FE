import DoodNftStaking from "layouts/doodnftstaking";
import DedNftStaking from "layouts/dednftstaking";
import SDoodStaking from "layouts/sdoodstaking";
import Swap from "layouts/swap";
import Mint from "layouts/mint";
import Information from "layouts/information";

// @mui icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";

const routes = [
  {
    type: "collapse",
    name: "DOODCAT NFT Staking",
    key: "DoodNftStaking",
    icon: <LoyaltyIcon />,
    route: "/DoodNftStaking",
    component: <DoodNftStaking />,
  },
  {
    type: "collapse",
    name: "DEDCAT NFT Staking",
    key: "DedNftStaking",
    icon: <LoyaltyIcon />,
    route: "/DedNftStaking",
    component: <DedNftStaking />,
  },
  {
    type: "collapse",
    name: "SDOOD Staking",
    key: "SDoodStaking",
    icon: <LocalOfferIcon />,
    route: "/SDoodStaking",
    component: <SDoodStaking />,
  },
  {
    type: "collapse",
    name: "Swap",
    key: "Swap",
    icon: <SwapHorizontalCircleIcon />,
    route: "/Swap",
    component: <Swap />,
  },
  {
    type: "collapse",
    name: "Mint",
    key: "Mint",
    icon: <MedicalServicesIcon />,
    route: "/Mint",
    component: <Mint />,
  },
  {
    type: "collapse",
    name: "Information",
    key: "Information",
    icon: <AssessmentIcon />,
    route: "/Information",
    component: <Information />,
  },
];

export default routes;
