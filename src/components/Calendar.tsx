// src/components/CustomCalendar.tsx
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
import { hScale, vScale } from '../styles/Scale.styles';
import { Colors } from '../styles/Color.styles';

interface CustomCalendarProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (year: number, month: number) => void;
  initialYear?: number;
  initialMonth?: number;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  isVisible,
  onClose,
  onSelectDate,
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth() + 1,
}) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  // 이전 년도로 이동
  const goToPreviousYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  // 다음 년도로 이동
  const goToNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  // 월 선택
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  // 확인 버튼 처리
  const handleConfirm = () => {
    onSelectDate(selectedYear, selectedMonth);
    onClose();
  };

  // 월 이름 배열 (한글)
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableWithoutFeedback onPress={()=>{}}>
          <View style={styles.calendarContainer}>
            {/* 년도 네비게이션 */}
            <View style={styles.yearNavigation}>
              <TouchableOpacity onPress={goToPreviousYear} style={styles.yearNavigationButton}>
                <Image source={require('../../assets/icons/left.png')} />
              </TouchableOpacity>
              
              <Text style={styles.yearText}>{selectedYear}</Text>
              
              <TouchableOpacity onPress={goToNextYear} style={styles.yearNavigationButton}>
              <Image source={require('../../assets/icons/right.png')} />
              </TouchableOpacity>
            </View>
            
            {/* 월 그리드 */}
            <View style={styles.monthGrid}>
              {monthNames.map((monthName, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.monthCell,
                    selectedMonth === index + 1 ? styles.selectedMonthCell : null,
                  ]}
                  onPress={() => handleMonthSelect(index + 1)}
                >
                  <Text
                    style={[
                      styles.monthText,
                      selectedMonth === index + 1 ? styles.selectedMonthText : null,
                    ]}
                  >
                    {monthName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* 확인 버튼 */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    top:vScale(230),
    left:hScale(188),
  },
  safeArea: {
  },

  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: hScale(8),
    //padding: hScale(12),
    width: hScale(156),
    height:vScale(264),
    alignItems: 'center',
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: hScale(131),
    height:vScale(24),
    marginBottom: vScale(10),
    marginTop:vScale(16),
  },
  yearNavigationButton: {
    padding: hScale(8),
    width: 40,
    alignItems: 'center',
    color: Colors.outlineVariant,
  },
  yearText: {
    fontSize: hScale(16),
    color: Colors.black,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: hScale(124),
    height:vScale(140),
    //marginBottom: 20,
  },
  monthCell: {
    width: hScale(38.67),
    height:hScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vScale(4),
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: hScale(2),
  },
  selectedMonthCell: {
    borderColor: '#00C900',
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
  },
  monthText: {
    fontSize: hScale(12),
    color: Colors.outline,
  },
  selectedMonthText: {
    color: '#00C853',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: hScale(8),
    paddingVertical: vScale(8),
    paddingHorizontal: hScale(20),
    width: hScale(132),
    height:vScale(48),
    marginTop:vScale(10),
    marginBottom:vScale(16),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: hScale(16),
  },
});

export default CustomCalendar;