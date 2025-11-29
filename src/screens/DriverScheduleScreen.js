import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Modal,
  FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, FONTS } from '../theme';
import { ChevronLeft, Clock, Check } from 'lucide-react-native';

const DAYS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function DriverScheduleScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { driverSchedule, updateDriverSchedule, toggleDayAvailability } = useData();
  
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeType, setSelectedTimeType] = useState(null); // 'start' or 'end'

  const handleToggleDay = (day) => {
    console.log('handleToggleDay called for:', day);
    console.log('Current schedule:', driverSchedule[day]);
    toggleDayAvailability(day);
  };

  const openTimePicker = (day, type) => {
    setSelectedDay(day);
    setSelectedTimeType(type);
    setTimePickerVisible(true);
  };

  const selectTime = (time) => {
    if (selectedDay && selectedTimeType) {
      const field = selectedTimeType === 'start' ? 'startTime' : 'endTime';
      updateDriverSchedule(selectedDay, { [field]: time });
    }
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Planning</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Horaires de disponibilité</Text>
        <Text style={styles.sectionSubtitle}>
          Définissez vos jours et heures de travail
        </Text>

        {DAYS.map((day) => {
          const schedule = driverSchedule[day.key] || { enabled: false, startTime: '09:00', endTime: '17:00' };
          return (
            <View key={day.key} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day.label}</Text>
                <Switch
                  value={schedule.enabled}
                  onValueChange={() => handleToggleDay(day.key)}
                  trackColor={{ false: COLORS.border, true: COLORS.success + '50' }}
                  thumbColor={schedule.enabled ? COLORS.success : COLORS.textLight}
                />
              </View>

              {schedule.enabled && (
                <View style={styles.timeRow}>
                  <TouchableOpacity 
                    style={styles.timeButton}
                    onPress={() => openTimePicker(day.key, 'start')}
                  >
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timeLabel}>Début</Text>
                    <Text style={styles.timeValue}>{schedule.startTime}</Text>
                  </TouchableOpacity>

                  <Text style={styles.timeSeparator}>→</Text>

                  <TouchableOpacity 
                    style={styles.timeButton}
                    onPress={() => openTimePicker(day.key, 'end')}
                  >
                    <Clock size={16} color={COLORS.secondary} />
                    <Text style={styles.timeLabel}>Fin</Text>
                    <Text style={styles.timeValue}>{schedule.endTime}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé</Text>
          <Text style={styles.summaryText}>
            {DAYS.filter(d => driverSchedule[d.key]?.enabled).length} jours actifs
          </Text>
          <Text style={styles.summarySubtext}>
            {DAYS.filter(d => driverSchedule[d.key]?.enabled)
              .map(d => d.label.slice(0, 3))
              .join(', ')}
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Sélectionner l'heure
              </Text>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={HOURS}
              keyExtractor={(item) => item}
              style={styles.hoursList}
              renderItem={({ item }) => {
                const isSelected = selectedDay && selectedTimeType && 
                  driverSchedule[selectedDay][selectedTimeType === 'start' ? 'startTime' : 'endTime'] === item;
                return (
                  <TouchableOpacity 
                    style={[styles.hourItem, isSelected && styles.hourItemSelected]}
                    onPress={() => selectTime(item)}
                  >
                    <Text style={[styles.hourText, isSelected && styles.hourTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <Check size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.l,
  },
  dayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.m,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.s,
    borderRadius: 8,
    gap: 8,
  },
  timeLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  timeValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 'auto',
  },
  timeSeparator: {
    marginHorizontal: SPACING.s,
    color: COLORS.textLight,
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 12,
    padding: SPACING.l,
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  summaryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  summarySubtext: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  modalCancel: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.primary,
  },
  hoursList: {
    padding: SPACING.m,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: 8,
  },
  hourItemSelected: {
    backgroundColor: COLORS.primary + '15',
  },
  hourText: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: COLORS.text,
  },
  hourTextSelected: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
