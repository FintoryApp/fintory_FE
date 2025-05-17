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
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const guidelineW = 360;
const guidelineH = 740;

const hScale = (s: number) => {
    const newSize = (W / guidelineW) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };
  
  const vScale = (s: number) => {
    const newSize = (H / guidelineH) * s;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

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
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea}>
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
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    top:vScale(240),
    left:hScale(188),
  },
  safeArea: {
  },

  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: hScale(4),
    //padding: hScale(12),
    width: hScale(156),
    height:vScale(266),
    alignItems: 'center',
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: vScale(1),
  },
  yearNavigationButton: {
    padding: hScale(8),
    width: 40,
    alignItems: 'center',
  },
  yearText: {
    fontSize: hScale(16),
    color: '#000',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: hScale(132),
    height:vScale(140),
    //marginBottom: 20,
  },
  monthCell: {
    width: hScale(41.33),
    height:hScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vScale(4),
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hScale(2),
  },
  selectedMonthCell: {
    borderColor: '#00C900',
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
  },
  monthText: {
    fontSize: hScale(12),
    color: '#AEAEAE',
  },
  selectedMonthText: {
    color: '#00C853',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#00C900',
    borderRadius: hScale(8),
    paddingVertical: vScale(8),
    paddingHorizontal: hScale(20),
    width: hScale(132),
    height:vScale(38),
    marginTop:vScale(12),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: hScale(16),
  },
});

export default CustomCalendar;