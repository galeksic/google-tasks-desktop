import React, { ComponentType, ReactElement } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

interface Props extends Partial<IconButtonProps> {
  tooltip?: string;
  icon?: ComponentType<SvgIconProps>;
  iconProps?: SvgIconProps;
  children?: ReactElement;
}

const popperProps = {
  popperOptions: {
    modifiers: {
      offset: {
        fn: (data: any) => {
          data.offsets.reference.top = data.offsets.reference.top + 75;
          return data;
        }
      }
    }
  }
};

export function IconButton({
  tooltip = '',
  icon: Icon,
  iconProps,
  children,
  className = '',
  ...props
}: Props) {
  return (
    <MuiIconButton className={`mui-icon-button ${className}`.trim()} {...props}>
      <Tooltip title={tooltip} PopperProps={popperProps}>
        {Icon ? <Icon {...iconProps} /> : children ? children : <div />}
      </Tooltip>
    </MuiIconButton>
  );
}
