import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  /**
   * img 이미지가 로딩되지 않을 경우 재로딩 시도하는 함수
   * @param event img 태그의 event
   */
  waitAndReload(event: any) {
    const originalSrc = event.target.src;

    if (parseInt(event.target.getAttribute('data-retry'), 10) !== parseInt(event.target.getAttribute('data-max-retry'), 10)) {
        event.target.setAttribute('data-retry', parseInt(event.target.getAttribute('data-retry'), 10) + 1);
        event.target.src = '/assets/images/loading.gif';

        setTimeout(() => {
            event.target.src = originalSrc;
        }, 2000);
    } else {
        event.target.src = '/assets/images/loading.gif';
    }
  }

  /**
   * 섬네일 이미지를 반환합니다.
   * @param url 원본 이미지 url
   * @param size 50,200,600
   */
  thumbnail(url: string, size: ThumbnailSize= '50x50'): string {
    const urlPattern =
      /^(https?:\/\/)([^:\/\s]+)(:([^\/]*))?((\/[^\s/\/]+)*)?\/([^#\s\?]*)(\?([^#\s]*))?(#(\w*))?$/g;
    // url 체크 파일명  group 7

    const fileName =
      url.replace(urlPattern, '$7');
    const nameSplits = fileName.split('.');
    const newFileName = `${nameSplits[0]}_${size}.${nameSplits[1]}`;
    const newUrl = url.replace(urlPattern, `$1$2$5/${newFileName}$8`);
    return newUrl;
  }

  /**
   * 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지됩니다.
   * @param operation - 실패한 동작의 이름
   * @param log - 실패내용 기록할 함수
   * @param result - 기본값으로 반환할 객체
   */
  handleErrorObservable<T>(operation = 'operation', result?: T, log?: (message: string) => void) {
    return (error: any): Observable<T> => {
      this.handlerError(operation, error, log);
      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
      return of(result as T);
    };
  }
  /**
   * 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지됩니다.
   * @param operation - 실패한 동작의 이름
   * @param log - 실패내용 기록할 함수
   * @param result - 기본값으로 반환할 객체
   */
  handleErrorPromise<T>(operation= 'operation', result?: T, log?: (message: string) => void) {
    return (error: any): Promise<T> => {
      this.handlerError(operation, error, log);
      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
      return of(result as T).toPromise(); // new Promise<T>(re => re(result));
    };
  }
  private handlerError(operation: string, error: any, log?: (message: string) => void) {
    // TODO: 리모트 서버로 에러 메시지 보내기
    console.error(error); // 지금은 콘솔에 로그를 출력합니다.

    // TODO: 사용자가 이해할 수 있는 형태로 변환하기
    if (log) { log(`${operation} failed: ${error.message}`); }
  }
}

export type ThumbnailSize =
| '50x50'
| '200x200'
| '600x600';
