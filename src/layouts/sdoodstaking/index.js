/* eslint-disable camelcase */
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Footer from "examples/Footer";
import MDButton from "components/MDButton";

import { notification } from "antd";

// ABI import
import SDOODSTAKINGABI from "../../assets/abi/sdoodstakingABI.json";
import SDOODABI from "../../assets/abi/sdoodABI.json";

// Config
import config from "../../config/config";

import "./sdoodstaking.css";

const ethers = require("ethers");

function SDoodStaking() {
  const { account } = useWeb3React();

  const [loadingStake1State, setLoadingStake1State] = useState(false);
  const [loadingStake2State, setLoadingStake2State] = useState(false);
  const [loadingStake3State, setLoadingStake3State] = useState(false);
  const [loadingStake4State, setLoadingStake4State] = useState(false);
  const [loadingClaimState, setLoadingClaimState] = useState(false);

  const [Amount_30, setAmount_30] = useState(0);
  const [Amount_60, setAmount_60] = useState(0);
  const [Amount_90, setAmount_90] = useState(0);
  const [Amount_120, setAmount_120] = useState(0);

  // const [sdoodContract, setSDooDContract] = useState(null);
  // const [sdoodStakingContract, setSDooDStakingContract] = useState(null);

  const [stakedDay, setStakedDay] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [earnPercent, setEarnPercent] = useState(0);
  const [stakeState, setStakeState] = useState(false);

  const newProvider = new ethers.providers.Web3Provider(window.ethereum);
  const newSigner = newProvider.getSigner();
  const sdoodContract = new ethers.Contract(config.SDOODADDRESS, SDOODABI, newSigner);

  const sdoodStakingContract = new ethers.Contract(
    config.SDOODSTAKINGADDRESS,
    SDOODSTAKINGABI,
    newSigner
  );

  const inputValue_30 = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setAmount_30(value);
  };

  const InputValue_60 = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setAmount_60(value);
  };

  const InputValue_90 = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setAmount_90(value);
  };

  const InputValue_120 = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setAmount_120(value);
  };

  // Claim State Function
  const claimState = () => {
    const presentTimeInSeconds = Math.floor(Date.now() / 1000);
    sdoodStakingContract.stakingInfos(account).then((stakeInfo) => {
      const c_stakedDay = Number(stakeInfo.stakingtype.toString()) / 3600 / 24;
      const c_lefttime = Number(stakeInfo.lockdeadline.toString());
      const c_stakedAmount = Number(stakeInfo.amount.toString()) / 10 ** 18;
      setStakedAmount(c_stakedAmount);
      setStakedDay(Math.floor((c_lefttime - presentTimeInSeconds) / 3600 / 24));
      setStakeState(stakeInfo.isStaked);
      if (c_stakedDay === 30) {
        setEarnPercent(5);
      } else if (c_stakedDay === 60) {
        setEarnPercent(10);
      } else if (c_stakedDay === 90) {
        setEarnPercent(15);
      } else if (c_stakedDay === 120) {
        setEarnPercent(25);
      }
    });
  };

  useEffect(() => {
    if (account) {
      claimState();
    }
  }, [account]);
  // Staking SDOOD Function
  const staking = async (amount, day) => {
    if (amount <= 0) {
      notification.error({
        message: "Error",
        description: "Min Amount is 1 SDOOD.",
      });
    } else {
      if (day === 30) {
        setLoadingStake1State(true);
      } else if (day === 60) {
        setLoadingStake2State(true);
      } else if (day === 90) {
        setLoadingStake3State(true);
      } else if (day === 120) {
        setLoadingStake4State(true);
      }

      const amountValue = ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(18));
      await sdoodContract.approve(config.SDOODSTAKINGADDRESS, amountValue).then((txApprove) => {
        txApprove.wait().then(() => {
          sdoodStakingContract
            .staking(amountValue, ethers.BigNumber.from((day * 24 * 3600).toString()), {
              gasLimit: 3000000,
            })
            .then((tx) => {
              tx.wait().then(() => {
                if (day === 30) {
                  setLoadingStake1State(false);
                } else if (day === 60) {
                  setLoadingStake2State(false);
                } else if (day === 90) {
                  setLoadingStake3State(false);
                } else if (day === 120) {
                  setLoadingStake4State(false);
                }
                notification.success({
                  message: "Success",
                  description: "Staking Successful.",
                });
                window.location.reload();
              });
            });
        });
      });
    }
  };
  // Claim SDOOD Function
  const claimStaking = async () => {
    setLoadingClaimState(true);
    await sdoodStakingContract.claimStaking({ gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        setLoadingClaimState(false);
        notification.success({
          message: "Success",
          description: "Claim Successful.",
        });
        window.location.reload();
      });
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="sdoodStakingContainer">
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  SDOOD STAKING
                </MDTypography>
              </MDBox>
              <MDBox p={6}>
                {!stakeState ? (
                  <Grid container spacing={4} mt={3} mb={3}>
                    <Grid item xs={12} xl={6} md={6} mb={3}>
                      <Card>
                        <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="success"
                          borderRadius="lg"
                          coloredShadow="info"
                        >
                          <MDTypography variant="h6" color="white">
                            STAKING OPTION - A
                          </MDTypography>
                        </MDBox>
                        <MDBox pt={3} ml={3} mr={3} mb={3}>
                          <MDTypography variant="h6" textAlign="center">
                            30 Days Lock period
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            0% Fees apply
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            5% Coin on release
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Early release fee 3.5%
                          </MDTypography>
                          <TextField
                            style={{ width: "100%", marginTop: "8%" }}
                            id="outlined-number"
                            label="SDOOD Amount"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={inputValue_30}
                          />
                          {account ? (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              onClick={() => staking(Amount_30, 30)}
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                {loadingStake1State ? (
                                  <CircularProgress
                                    color="inherit"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                ) : (
                                  "STAKING"
                                )}
                              </MDTypography>
                            </MDButton>
                          ) : (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              disabled
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                STAKING
                              </MDTypography>
                            </MDButton>
                          )}
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} xl={6} md={6}>
                      <Card>
                        <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="success"
                          borderRadius="lg"
                          coloredShadow="info"
                        >
                          <MDTypography variant="h6" color="white">
                            STAKING OPTION - B
                          </MDTypography>
                        </MDBox>
                        <MDBox pt={3} ml={3} mr={3} mb={3}>
                          <MDTypography variant="h6" textAlign="center">
                            60 Days Lock period
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            0% Fees apply
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            10% Coin on release
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Early release fee 3.5%
                          </MDTypography>
                          <TextField
                            style={{ width: "100%", marginTop: "8%" }}
                            id="outlined-number"
                            label="SDOOD Amount"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={InputValue_60}
                          />
                          {account ? (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              onClick={() => staking(Amount_60, 60)}
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                {loadingStake2State ? (
                                  <CircularProgress
                                    color="inherit"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                ) : (
                                  "STAKING"
                                )}
                              </MDTypography>
                            </MDButton>
                          ) : (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              disabled
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                STAKING
                              </MDTypography>
                            </MDButton>
                          )}
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} xl={6} md={6}>
                      <Card>
                        <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="success"
                          borderRadius="lg"
                          coloredShadow="info"
                        >
                          <MDTypography variant="h6" color="white">
                            STAKING OPTION - C
                          </MDTypography>
                        </MDBox>
                        <MDBox pt={3} ml={3} mr={3} mb={3}>
                          <MDTypography variant="h6" textAlign="center">
                            90 Days Lock period
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            0% Fees apply
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            15% Coin on release
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Early release fee 5.5%
                          </MDTypography>
                          <TextField
                            style={{ width: "100%", marginTop: "8%" }}
                            id="outlined-number"
                            label="SDOOD Amount"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={InputValue_90}
                          />
                          {account ? (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              onClick={() => staking(Amount_90, 90)}
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                {loadingStake3State ? (
                                  <CircularProgress
                                    color="inherit"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                ) : (
                                  "STAKING"
                                )}
                              </MDTypography>
                            </MDButton>
                          ) : (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              disabled
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                STAKING
                              </MDTypography>
                            </MDButton>
                          )}
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} xl={6} md={6} mb={3}>
                      <Card>
                        <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="success"
                          borderRadius="lg"
                          coloredShadow="info"
                        >
                          <MDTypography variant="h6" color="white">
                            STAKING OPTION - D
                          </MDTypography>
                        </MDBox>
                        <MDBox pt={3} ml={3} mr={3} mb={3}>
                          <MDTypography variant="h6" textAlign="center">
                            120 Days Lock period
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            0% Fees apply
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            25% Coin on release
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Early release fee 5.5%
                          </MDTypography>
                          <TextField
                            style={{ width: "100%", marginTop: "8%" }}
                            id="outlined-number"
                            label="SDOOD Amount"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={InputValue_120}
                          />
                          {account ? (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              onClick={() => staking(Amount_120, 120)}
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                {loadingStake4State ? (
                                  <CircularProgress
                                    color="inherit"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                ) : (
                                  "STAKING"
                                )}
                              </MDTypography>
                            </MDButton>
                          ) : (
                            <MDButton
                              color="success"
                              style={{ width: "100%", marginTop: "8%" }}
                              disabled
                            >
                              <MDTypography variant="h6" textAlign="center" color="white">
                                STAKING
                              </MDTypography>
                            </MDButton>
                          )}
                        </MDBox>
                      </Card>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={4} mt={3} mb={3}>
                    <Grid item xs={12} xl={4} md={4} mb={3} />
                    <Grid item xs={12} xl={4} md={4}>
                      <Card>
                        <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="success"
                          borderRadius="lg"
                          coloredShadow="info"
                        >
                          <MDTypography variant="h6" color="white">
                            CLAIM
                          </MDTypography>
                        </MDBox>
                        <MDBox pt={3} ml={3} mr={3} mb={3}>
                          <MDTypography variant="h6" textAlign="center">
                            Total sDOOD Staked: {stakedAmount} sDOOD
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Day Left to Mature: {stakedDay} days
                          </MDTypography>
                          <MDTypography variant="h6" textAlign="center">
                            Earning: {earnPercent} %
                          </MDTypography>
                          <MDButton
                            color="success"
                            style={{ width: "100%", marginTop: "8%" }}
                            onClick={() => claimStaking()}
                          >
                            {loadingClaimState ? (
                              <CircularProgress
                                color="inherit"
                                style={{ width: "20px", height: "20px" }}
                              />
                            ) : (
                              "CLAIM"
                            )}
                          </MDButton>
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} xl={4} md={4} />
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SDoodStaking;
