import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";

const BASE_URL = "http://192.168.29.225:5000"; // Your PC IP

export default function ServicePage({ route, navigation }) {
  const { department } = route.params; // Pass department from login
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${BASE_URL}/worker/complaints/${department}`);
      const data = await res.json();
      if (data.success) setComplaints(data.complaints);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch complaints");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/worker/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", data.message);
        fetchComplaints(); // refresh list
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Status: {item.status}</Text>

      {item.status !== "Completed" && (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Button title="In Progress" onPress={() => updateStatus(item._id, "In Progress")} />
          <View style={{ width: 10 }} />
          <Button title="Completed" onPress={() => updateStatus(item._id, "Completed")} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assigned Complaints</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No complaints assigned</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  title: { fontSize: 18, fontWeight: "bold" },
});
