'use client'

import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@propet/ui/lib/utils'
import * as React from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, ...props }: ControllerProps<TFieldValues, TName>) {
  const contextValue = React.useMemo(() => ({ name }), [name])

  return (
    <FormFieldContext value={contextValue}>
      <Controller control={control} name={name} {...props} />
    </FormFieldContext>
  )
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

function useFormField() {
  const fieldContext = React.use(FormFieldContext)
  const itemContext = React.use(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext.name)
    throw new Error('useFormField must be used within FormField')

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()
  const contextValue = React.useMemo(() => ({ id }), [id])

  return (
    <FormItemContext value={contextValue}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const { error, formItemId } = useFormField()

  return (
    <label
      data-slot="form-label"
      data-error={Boolean(error)}
      className={cn('text-sm font-medium data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ render, ...props }: useRender.ComponentProps<'div'>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const describedBy = error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        'data-slot': 'form-control',
        'id': formItemId,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      } as React.ComponentProps<'div'>,
      props,
    ),
    render,
  })
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : children

  if (!body)
    return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
