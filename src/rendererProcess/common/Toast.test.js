import { screen } from '@testing-library/dom';
import Toast from './Toast';

describe('Toast Test', () => {
  test('메세지를 넣어서 렌더 시키면 화면에 렌더링 됩니다.', () => {
    jest.useFakeTimers();

    const toast = new Toast('test');
    const testText = 'visual-system';

    toast.render(testText);

    expect(screen.getByText(testText)).toBeInTheDocument();

    jest.runAllTimers();
  });

  test('일정 시간이 지난후 사라집니다.', () => {
    jest.useFakeTimers();

    const toast = new Toast('test');
    const testText = 'visual-system';

    const interval = 300;

    toast.render(testText, null, interval);

    const toastElement = screen.getByText(testText);

    expect(toastElement).toBeInTheDocument();

    jest.advanceTimersByTime(interval);

    expect(toastElement).not.toBeInTheDocument();
  });
});
