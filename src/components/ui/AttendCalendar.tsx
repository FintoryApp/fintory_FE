import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  PixelRatio,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';
import { Colors } from '../../styles/Color.styles';

interface AttendCalendarProps {
  month?: number;
  year?: number;
  attendanceData?: { [key: number]: boolean };
  streakDays?: number;
}

export default function AttendCalendar({ 
  month = 7, 
  year = 2025, 
  attendanceData = {},
  streakDays = 3 
}: AttendCalendarProps) {
  const [isModalVisible, setModalVisible] = useState(false);

  // 7월 달력 데이터 생성 (2025년 7월 기준)
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0: 일요일
    const totalDays = new Date(year, month, 0).getDate(); // 해당 월의 총 일수
    
    // 첫 주의 빈 칸들
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isAttended: false });
    }
    
    // 실제 날짜들
    for (let day = 1; day <= totalDays; day++) {
      days.push({ 
        day, 
        isAttended: attendanceData[day] || false 
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.container}>
        
        {/* 출석현황 Container */}
        
          <View style={styles.mainContainer}>
            <Image 
              source={require('../../../assets/icons/calendar.png')} 
              style={styles.calendarIcon} 
            />
            <View style={styles.titleContainer}>
            <Text style={styles.title}>{month}월달 출석 현황</Text>
            <Text style={styles.subtitle}>연속 출석 {streakDays}일 째</Text>
            </View>
          </View>
          
        <View style={styles.calendarContainer}>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((item, index) => (
            <View key={index} style={styles.dayContainer}>
              {item.day && (
                <View style={[
                  styles.dayButton,
                  item.isAttended ? styles.attendedDay : styles.normalDay
                ]}>
                  <Text style={[
                    styles.dayText,
                    item.isAttended ? styles.attendedDayText : styles.normalDayText
                  ]}>
                    {item.day}
                  </Text>
                  {item.isAttended && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkMarkText}>✓</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
        </View>
      </TouchableOpacity>

      {/* 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{month}월 출석 현황</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalCalendarGrid}>
                  {weekDays.map((day, index) => (
                    <Text key={index} style={styles.modalWeekDay}>{day}</Text>
                  ))}
                  {calendarDays.map((item, index) => (
                    <View key={index} style={styles.modalDayContainer}>
                      {item.day && (
                        <View style={[
                          styles.modalDayButton,
                          item.isAttended ? styles.modalAttendedDay : styles.modalNormalDay
                        ]}>
                          <Text style={[
                            styles.modalDayText,
                            item.isAttended ? styles.modalAttendedDayText : styles.modalNormalDayText
                          ]}>
                            {item.day}
                          </Text>
                          {item.isAttended && (
                            <View style={styles.modalCheckMark}>
                              <Text style={styles.modalCheckMarkText}>✓</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: hScale(328),
    height: vScale(422),
    backgroundColor: Colors.white,
    borderRadius: hScale(16),
    paddingHorizontal: hScale(16),
    paddingVertical: vScale(16),
  },
  header: {
  },
  mainContainer: {
    width: hScale(150),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vScale(16), 
  },
  
  calendarIcon: {
    width: hScale(44),
    height: hScale(44),
    tintColor: Colors.primaryDark,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: hScale(16),
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: hScale(12),
    color: Colors.outline,
  },
  calendarContainer: {
    width: hScale(296),
    height: vScale(330),
    paddingHorizontal: hScale(10),
    paddingVertical: vScale(10),
    alignSelf: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: vScale(12),
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: hScale(12),
    color: Colors.outline,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: hScale(328) / 7,
    height: vScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: hScale(28),
    height: hScale(28),
    borderRadius: hScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  normalDay: {
    backgroundColor: Colors.surface,
  },
  attendedDay: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: hScale(12),
    fontWeight: '500',
  },
  normalDayText: {
    color: Colors.outline,
  },
  attendedDayText: {
    color: Colors.primary,
  },
  checkMark: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: hScale(12),
    height: hScale(12),
    borderRadius: hScale(6),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    fontSize: hScale(8),
    color: Colors.white,
    fontWeight: 'bold',
  },
  
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: hScale(320),
    backgroundColor: Colors.white,
    borderRadius: hScale(16),
    padding: hScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vScale(20),
  },
  modalTitle: {
    fontSize: hScale(18),
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    width: hScale(24),
    height: hScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: hScale(16),
    color: Colors.outline,
  },
  modalCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalWeekDay: {
    width: hScale(320) / 7,
    textAlign: 'center',
    fontSize: hScale(14),
    color: Colors.outline,
    fontWeight: '500',
    marginBottom: vScale(8),
  },
  modalDayContainer: {
    width: hScale(320) / 7,
    height: vScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDayButton: {
    width: hScale(32),
    height: hScale(32),
    borderRadius: hScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalNormalDay: {
    backgroundColor: Colors.surface,
  },
  modalAttendedDay: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  modalDayText: {
    fontSize: hScale(14),
    fontWeight: '500',
  },
  modalNormalDayText: {
    color: Colors.outline,
  },
  modalAttendedDayText: {
    color: Colors.primary,
  },
  modalCheckMark: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: hScale(14),
    height: hScale(14),
    borderRadius: hScale(7),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCheckMarkText: {
    fontSize: hScale(10),
    color: Colors.white,
    fontWeight: 'bold',
  },
});



