import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface Props {
  src?: string;
  className?: string;
  username?: string;
}

const UserAvatar = ({ src, className }: Props) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src}></AvatarImage>
    </Avatar>
  );
};

export default UserAvatar;
