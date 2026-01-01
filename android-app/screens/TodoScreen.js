import { View, Text, FlatList, Modal, Alert } from "react-native";
import {
  initDatabase,
  getAllItems,
  addItem,
  deleteItem,
  updateItemCompleted,
  updateItem,
} from "../db/database";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import InputText from "../components/InputText";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";

export default function TodoScreen() {
  const [todos, setTodos] = useState([]);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: 0,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await fetchTodos();
      } catch (error) {
        console.error("Initialization error:", error);
        showToast("Failed to initialize database", "error");
      }
    };
    init();
  }, []);

  const fetchTodos = async () => {
    try {
      const todos = await getAllItems();
      setTodos(todos);
    } catch (error) {
      showToast("Failed to fetch todos", "error");
    }
  };

  const handleSaveTodo = async () => {
    try {
      if (!formData.name.trim()) {
        showToast("Name is required", "error");
        return;
      }
      const priority = parseInt(formData.priority) || 0;

      if (editingTodoId) {
        await updateItem(
          editingTodoId,
          formData.name,
          formData.description,
          priority
        );
        showToast("Todo updated successfully", "success");
      } else {
        await addItem(formData.name, formData.description, priority);
        showToast("Todo added successfully", "success");
      }

      setFormData({ name: "", description: "", priority: "" });
      setEditingTodoId(null);
      setVisibleAddModal(false);
      await fetchTodos();
    } catch (error) {
      console.error("SaveTodo error:", error);
      showToast("Failed to save todo", "error");
    }
  };

  const handleEditPress = (todo) => {
    setFormData({
      name: todo.name,
      description: todo.description || "",
      priority: todo.priority,
    });
    setEditingTodoId(todo.id);
    setVisibleAddModal(true);
  };

  const handleCloseModal = () => {
    setVisibleAddModal(false);
    setEditingTodoId(null);
    setFormData({ name: "", description: "", priority: 0 });
  };

  const toggleTodoCompleted = async (id, currentStatus) => {
    try {
      await updateItemCompleted(id, !currentStatus);
      showToast(
        `Task marked as ${!currentStatus ? "completed" : "incomplete"}`,
        "success"
      );
      fetchTodos();
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const deleteTodo = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this todo?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteItem(id);
              showToast("Todo deleted successfully", "success");
              fetchTodos();
            } catch (error) {
              showToast("Failed to delete todo", "error");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Daily Note</Text>
      <Text style={globalStyles.subtext}>Total Notes: {todos.length}</Text>

      <Button
        title="New Task"
        iconName="add-circle"
        onPress={() => setVisibleAddModal(true)}
        style={{ marginBottom: 20 }}
      />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  globalStyles.modalHeaderTitle,
                  {
                    fontSize: 18,
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    color: item.completed ? colors.subtext : colors.text,
                  },
                ]}
              >
                {item.name}
              </Text>
              <Text style={globalStyles.subtext}>{item.description}</Text>
              <Text
                style={[
                  styles.todoPriority,
                  {
                    backgroundColor:
                      item.priority === 2
                        ? colors.danger
                        : item.priority === 1
                        ? "#ffc107"
                        : colors.secondary,
                  },
                ]}
              >
                {item.priority === 2
                  ? "High"
                  : item.priority === 1
                  ? "Medium"
                  : "Normal"}
              </Text>
            </View>
            <View style={styles.actions}>
              <Button
                iconName={item.completed ? "arrow-undo" : "checkmark-done"}
                onPress={() => toggleTodoCompleted(item.id, item.completed)}
                type={item.completed ? "secondary" : "success"}
                style={styles.actionButton}
              />
              {!item.completed && (
                <>
                  <Button
                    iconName="pencil"
                    onPress={() => handleEditPress(item)}
                    type="primary"
                    style={styles.actionButton}
                  />
                  <Button
                    iconName="trash"
                    onPress={() => deleteTodo(item.id)}
                    type="danger"
                    style={styles.actionButton}
                  />
                </>
              )}
            </View>
          </View>
        )}
        style={{ width: "100%" }}
      />

      <Modal
        visible={visibleAddModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalCard}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalHeaderTitle}>
                {editingTodoId ? "Edit Todo" : "Add Todo"}
              </Text>
            </View>

            <View style={globalStyles.modalBody}>
              <InputText
                label={<Text>Name <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Enter task name"
                value={formData.name}
                onChangeText={(name) => setFormData({ ...formData, name })}
              />

              <InputText
                label="Description"
                placeholder="Enter task description"
                value={formData.description}
                onChangeText={(description) =>
                  setFormData({ ...formData, description })
                }
              />

              <View style={styles.priorityContainer}>
                <Text
                  style={[
                    globalStyles.text,
                    { fontWeight: "600", marginBottom: 12 },
                  ]}
                >
                  Priority
                </Text>
                <View style={styles.tagRow}>
                  {[
                    { label: "Normal", value: 0, color: colors.secondary },
                    { label: "Medium", value: 1, color: "#ffc107" },
                    { label: "High", value: 2, color: colors.danger },
                  ].map((p) => (
                    <Button
                      key={p.value}
                      title={p.label}
                      onPress={() =>
                        setFormData({ ...formData, priority: p.value })
                      }
                      type={
                        formData.priority === p.value ? "primary" : "secondary"
                      }
                      style={[
                        styles.tagButton,
                        formData.priority === p.value && {
                          backgroundColor: p.color,
                        },
                      ]}
                      textStyle={{ fontSize: 12 }}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={globalStyles.modalFooter}>
              <Button
                iconName="close"
                onPress={handleCloseModal}
                type="danger"
                style={styles.footerButton}
              />
              <Button
                title={editingTodoId ? "Update" : "Save"}
                iconName={editingTodoId ? "save" : "add"}
                onPress={handleSaveTodo}
                type="success"
                style={styles.footerButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  todoPriority: {
    fontSize: 11,
    color: "#fff",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  priorityContainer: {
    marginTop: 8,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  tagButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  footerButton: {
    width: "47%",
  },
};
