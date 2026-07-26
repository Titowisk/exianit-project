import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TagService } from '../../services/tag.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Tag } from '../../models/tag.interface';

const MAX_TAGS = 15;

@Component({
  selector: 'app-tags',
  imports: [CommonModule, ReactiveFormsModule, InputText, Button, ProgressSpinner],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {
  private fb = inject(FormBuilder);
  private tagService = inject(TagService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);

  tags = signal<Tag[]>([]);
  isLoading = signal(false);
  isCreating = signal(false);
  backendErrors = signal<Record<string, string[]>>({});

  isAtLimit = computed(() => this.tags().length >= MAX_TAGS);

  tagForm: FormGroup;

  constructor() {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      color: ['#4CAF50', [Validators.required]]
    });

    this.tagForm.valueChanges.subscribe(() => {
      const currentErrors = this.backendErrors();
      const clearedErrors: Record<string, string[]> = {};
      Object.keys(currentErrors).forEach(field => {
        if (this.tagForm.get(field)?.pristine) {
          clearedErrors[field] = currentErrors[field];
        }
      });
      this.backendErrors.set(clearedErrors);
    });

    this.loadTags();
  }

  get name() { return this.tagForm.get('name'); }
  get color() { return this.tagForm.get('color'); }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.tagForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getBackendErrors(field: string): string[] {
    return this.backendErrors()[field] || [];
  }

  loadTags(): void {
    this.isLoading.set(true);
    this.tagService.getTags().subscribe({
      next: (tags) => {
        this.tags.set(tags);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorHandler.showErrorToast(error, 'Error Loading Tags', 'Failed to load tags.');
      }
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid || this.isAtLimit()) {
      this.tagForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    this.backendErrors.set({});

    const { name, color } = this.tagForm.value;

    this.tagService.createTag(name.trim(), color).subscribe({
      next: (tag) => {
        this.isCreating.set(false);
        this.tags.update(tags => [...tags, tag]);
        this.messageService.add({
          severity: 'success',
          summary: 'Tag Created',
          detail: `Tag "${tag.name}" created successfully!`,
          life: 3000
        });
        this.tagForm.reset({ name: '', color: '#4CAF50' });
        this.backendErrors.set({});
      },
      error: (error) => {
        this.isCreating.set(false);
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        if (Object.keys(fieldErrors).length > 0) {
          this.backendErrors.set(fieldErrors);
        } else {
          this.errorHandler.showErrorToast(error, 'Error Creating Tag', 'Failed to create tag.');
        }
      }
    });
  }
}
