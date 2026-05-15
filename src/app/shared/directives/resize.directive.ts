import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, NgZone, OnDestroy, Output, Renderer2 } from '@angular/core';

import { DOCUMENT } from '@angular/common';

type ResizeAxis = 'x' | 'y';

@Directive({
	selector: '[appResize]'
})
export class ResizeDirective implements OnDestroy {
	@Input() resizeAxis: ResizeAxis = 'x';

	@Input() min = 100;
	@Input() max?: number;

	@Input() reverse = false;
	@Input() container: string | HTMLElement = 'body';

	/**
	 * Class to add to the body while resizing
	 */
	@Input() resizingClass: string;

	@Output() resizeEnd = new EventEmitter<number>();
	@Output() resize = new EventEmitter<number>();

	private resizing = false;
	private currentValue: number | null = null;
	private containerRect?: DOMRect;

	private animationFrame: number | null = null;
	private latestEvent: PointerEvent | null = null;

	private removeMove?: () => void;
	private removeUp?: () => void;

	constructor(
		private elementRef: ElementRef<HTMLElement>,
		private renderer: Renderer2,
		private zone: NgZone,
		@Inject(DOCUMENT) private document: Document
	) { }

	ngOnDestroy(): void {
		this.stopResize();
	}

	@HostListener('pointerdown', ['$event'])
	startResize(event: PointerEvent): void {
		event.preventDefault();

		this.resizing = true;

		this.renderer.addClass(this.document.body, this.resizingClass);
		this.renderer.addClass(this.elementRef.nativeElement, 'active');

		const container = this.resolveContainer();

		if (!container) {
			return;
		}

		this.containerRect = container.getBoundingClientRect();

		this.zone.runOutsideAngular(() => {
			this.removeMove = this.renderer.listen(this.document, 'pointermove', this.onResize);
			this.removeUp = this.renderer.listen(this.document, 'pointerup', this.stopResize);
		});
	}

	private onResize = (event: PointerEvent): void => {
		if (!this.resizing) {
			return;
		}

		this.latestEvent = event;

		if (this.animationFrame !== null) {
			return;
		}

		this.animationFrame = requestAnimationFrame(() => {
			this.animationFrame = null;

			if (!this.latestEvent) {
				return;
			}

			const rect = this.containerRect;

			if (!rect) {
				return;
			}

			const size = this.resizeAxis === 'x' ? rect.width : rect.height;
			const pointer = this.resizeAxis === 'x' ? this.latestEvent!.clientX : this.latestEvent!.clientY;
			const start = this.resizeAxis === 'x' ? rect.left : rect.top;
			const end = this.resizeAxis === 'x' ? rect.right : rect.bottom;
			let value = this.reverse ? end - pointer : pointer - start;
			const max = this.max ?? size;

			value = Math.max(this.min, Math.min(max, value));

			this.currentValue = value;

			this.zone.run(() => {
				this.resize.emit(value);
			});
		});
	};

	private stopResize = (): void => {
		this.resizing = false;

		this.renderer.removeClass(
			this.document.body,
			this.resizingClass
		);

		this.renderer.removeClass(
			this.elementRef.nativeElement,
			'active'
		);

		this.removeMove?.();
		this.removeUp?.();

		this.removeMove = undefined;
		this.removeUp = undefined;

		this.containerRect = undefined;

		if (this.animationFrame !== null) {
			cancelAnimationFrame(this.animationFrame);

			this.animationFrame = null;
		}

		if (this.currentValue !== null) {
			this.zone.run(() => {
				this.resizeEnd.emit(this.currentValue!);
			});

			this.currentValue = null;
		}
	};

	private resolveContainer(): HTMLElement | null {
		if (this.container instanceof HTMLElement) {
			return this.container;
		}

		if (this.container === 'parent') {
			return this.elementRef.nativeElement.parentElement;
		}

		return this.document.querySelector(this.container);
	}
}
