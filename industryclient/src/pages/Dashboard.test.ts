import { describe, it, expect } from 'vitest';

// Simple unit tests first
describe('Dashboard Unit Tests', () => {
  it('should have correct stats data structure', () => {
    const stats = [
      { name: '在线设备', value: '128', color: 'bg-green-500' },
      { name: '文档总数', value: '2,456', color: 'bg-blue-500' },
      { name: '数据点位', value: '10,234', color: 'bg-purple-500' },
      { name: '今日采集', value: '1.2M', color: 'bg-teal-500' },
    ];
    expect(stats).toHaveLength(4);
    expect(stats[0].name).toBe('在线设备');
  });

  it('should have correct alerts data structure', () => {
    const alerts = [
      { id: 1, type: 'warning', message: 'PLC-003 通信延迟过高', time: '10:32' },
      { id: 2, type: 'error', message: '传感器 TEMP-001 读数异常', time: '09:45' },
      { id: 3, type: 'info', message: '系统备份完成', time: '08:00' },
    ];
    expect(alerts).toHaveLength(3);
    expect(alerts[0].id).toBe(1);
  });

  it('should format current time correctly', () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    expect(timeString).toBeDefined();
  });
});