import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Alert, Platform } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Button } from "@/components/atoms";
import { InputField, NfcScanner } from "@/components/molecules";
import { LocationSelector, RaceSelector } from "@/components/organisms";
import { Colors } from "@/constants";
import { Race, Location } from "@/types";

const LOGO_IMAGE = require("@/assets/images/ytads_logo.png");

export default function Registration() {
  // Form State
  const [name, setName] = useState("");
  const [ldap, setLdap] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [races, setRaces] = useState<Race[]>([]);

  // NFC State
  const [skiPass, setSkiPass] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [nfcMessage, setNfcMessage] = useState("Ready to scan");

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    NfcManager.start();
    fetchRaces();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    };
  }, []);

  const fetchRaces = async () => {
    try {
      const response = await fetch("http://ski.batti.no/api/races");
      if (response.ok) {
        const data = await response.json();
        setRaces(data);
      }
    } catch (error) {
      console.error("Failed to fetch races:", error);
      Alert.alert("Error", "Could not load races. Please check your connection.");
    }
  };

  const handleNfcScan = async () => {
    try {
      setIsScanning(true);
      setNfcMessage("Scan your ski pass...");

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      
      if (tag?.id) {
        setSkiPass(tag.id);
        setNfcMessage("Scan successful!");
      }
    } catch (ex) {
      console.warn(ex);
      setNfcMessage("Scan canceled or failed.");
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !ldap || !selectedLocation || !selectedRace || !skiPass) {
      Alert.alert("Missing Fields", "Please complete the form and scan your pass.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://ski.batti.no/api/racers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ldap,
          location: selectedLocation,
          race_id: selectedRace.race_id,
          ski_pass: skiPass,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "You are now registered!");
        // Clear form
        setName("");
        setLdap("");
        setSkiPass(null);
        setNfcMessage("Ready to scan");
      } else {
        const errData = await response.json();
        Alert.alert("Error", errData.message || "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBanner}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.section}>
        <NfcScanner
          onScan={handleNfcScan}
          isScanning={isScanning}
          skiPass={skiPass}
          message={nfcMessage}
        />
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Your Name"
          value={name}
          onChangeText={setName}
          placeholder="First Last"
        />

        <InputField
          label="Your LDAP"
          value={ldap}
          onChangeText={setLdap}
          placeholder="username"
          autoCapitalize="none"
        />

        <LocationSelector
          selectedLocation={selectedLocation}
          onSelect={setSelectedLocation}
        />

        <RaceSelector
          races={races}
          selectedRace={selectedRace}
          onSelect={setSelectedRace}
        />

        <Button
          title={isSubmitting ? "Registering..." : "Register"}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || isScanning}
          size="lg"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: "center", paddingBottom: 40 },
  headerBanner: {
    width: "90%",
    height: 80,
    backgroundColor: "#60a5fa",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  logo: { width: 120, height: 50 },
  formContainer: { width: "100%", maxWidth: 340, gap: 15 },
  section: { width: "100%", maxWidth: 340, marginBottom: 10 },
});