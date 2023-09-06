import "react-native-get-random-values"; //Must be the first import
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useBalance } from "./useBalance.js";
import { useAddressObjects } from "./useAddressObjects.js";
import { toAddresses } from "./toAddresses.js";
import { Input, Button, ThemeProvider } from "react-native-elements";
import { send } from "./send.js";

const styles = {
  container: {
    marginTop: 50,
    padding: 10,
  },
};

//Lets hard code a mnemonic for this example,so we can send it assets and RVN

//Create a random mnemonic
//const randomMnemonic = RavencoinHandler.generateMnemonic();

export default function App() {
  const [mnemonic] = React.useState(
    "diagram gossip squirrel attitude illness table degree hello cannon saddle play afford"
  );
  const [tick, setTick] = React.useState(0);
  const addressObjects = useAddressObjects(mnemonic);

  const [toAddress, setToAddress] = React.useState(
    "mzn451nQQEHSwBupLuRDpxfqhorC5uGCBX"
  );
  const addresses = toAddresses(addressObjects);
  const balance = useBalance(tick, addresses);

  //Set a ticker that so we can update lets say every 30 seconds
  //If you want to force an update, just update "tick"
  React.useEffect(() => {
    function ticky() {
      setTick(new Date().getTime());
    }
    const interval = setInterval(ticky, 30 * 1000);
    ticky(); //Run once on startup
    return function cleanUp() {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>
        Ravencoin packages from @RavenRebels!
      </Text>
      <Text style={{ fontSize: 18, marginTop: 20 }}>TESTNET</Text>
      <TextWithLabel label="Mnemonic" text={mnemonic} />
      <TextWithLabel
        label="First address (testnet)"
        text={addresses.length && addresses[0]}
      />
      <TextWithLabel label="Balance" text={balance / 1e8} />

      <View style={{ background: "#EEEEEE", marginTop: 40 }}>
        <Text style={{ fontSize: 28 }}>Send RVN</Text>
        <Input
          placeholder="Enter Ravencoin address here"
          containerStyle={{ width: 340 }} // Set the width here
          label="To address"
          defaultValue={toAddress}
          onChangeText={(text) => {
            setToAddress(text);
          }}
          leftIcon={{ type: "font-awesome", name: "user" }} // Adjust the icon as needed
        />
        <Button
          title="Send 1 RVN"
          onPress={(event) => {
            send(addressObjects, 1, toAddress);
          }}
        ></Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function TextWithLabel({ label, text }) {
  return (
    <View style={{ marginTop: 40 }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: 600 }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 20 }}>{text}</Text>
    </View>
  );
}
