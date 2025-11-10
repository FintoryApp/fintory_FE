import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { hScale, vScale } from '../../styles/Scale.styles';
import { Colors } from '../../styles/Color.styles';
import { getAttendance } from '../../api/getAttendance.ts';

interface AttendCalendarProps {
  month?: number;
  year?: number;
  attendance?: { [key: number]: boolean };
  streak?: number;
  refreshTrigger?: number; // 데이터 새로고침을 위한 트리거
}

export default function AttendCalendar({
  month = new Date().getMonth()+1, 
  year = new Date().getFullYear(), 
  attendance = {},
  streak = 0,
  refreshTrigger = 0,
}: AttendCalendarProps) 
{
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: boolean }>({});

  // 출석 데이터 가져오기 (연속 출석일수는 로그인 시에만 처리)
  useEffect(() => { 
    const fetchAttendanceData = async () => {
      try {
        const attendanceResponse = await getAttendance();
        
        // 현재 달의 모든 날짜를 false로 초기화
        const daysInMonth = new Date(year, month, 0).getDate();
        const newAttendanceData: { [key: number]: boolean } = {};
        
        for (let i = 1; i <= daysInMonth; i++) {
          newAttendanceData[i] = false;
        }
        
        // 출석 데이터 처리
        if (attendanceResponse.data && Array.isArray(attendanceResponse.data)) {
          attendanceResponse.data.forEach((item: any) => {
            const raw = item.attendanceLog;      // 예: "2025-10-01" 또는 "2025-10-01T09:00:00"
            if (!raw) return;

            const [datePart] = String(raw).split('T');
            const [y, m, d] = datePart.split('-').map(Number);

            if (y === year && m === month) {
              newAttendanceData[d] = true;
            }
          });
        }

        setAttendanceData(newAttendanceData);
      } catch (error) {
        console.error('출석 데이터 가져오기 실패:', error);
      }
    };
    
    fetchAttendanceData();
  }, [month, year, refreshTrigger]);
  
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

  return (
    <View style={styles.container}>
        
        {/* 출석현황 Container */}
        
          <View style={styles.mainContainer}>
            <Image 
              source={require('../../../assets/icons/calendar.png')} 
              style={styles.calendarIcon} 
            />
            <View style={styles.titleContainer}>
            <Text style={styles.title}>{month}월달 출석 현황</Text>
            <Text style={styles.subtitle}>연속 출석 {streak}일 째</Text>
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
                  {!item.isAttended && (
                    <Text style={[
                      styles.dayText,
                      styles.normalDayText
                    ]}>
                      {item.day}
                    </Text>
                  )}
                  {item.isAttended && (
                    <Image 
                      source={require('../../../assets/icons/attendCheck.png')} 
                      style={styles.checkMarkImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: hScale(328),
    height: 'auto',
    backgroundColor: Colors.white,
    borderRadius: hScale(16),
    paddingHorizontal: hScale(16),
    paddingVertical: vScale(16),
    alignSelf: 'center',
  },
  header: {
  },
  mainContainer: {
    width: hScale(150),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vScale(16), 
    //alignSelf: 'center',
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
    height: 'auto',
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
    //gap: hScale(10),
  },
  dayContainer: {
    width: '14.2857%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vScale(24),
  },
  dayButton: {
    width: hScale(32),
    height: hScale(32),
    borderRadius: hScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  normalDay: {
    backgroundColor: Colors.surface,
  },
  attendedDay: {
    backgroundColor: Colors.white,
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
  checkMarkImage: {
    width: hScale(32),
    height: hScale(32),
  },
});



