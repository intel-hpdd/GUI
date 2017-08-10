import Inferno from 'inferno';

export default ({ display }: { display: boolean }) => {
  if (display) return <i class="fa fa-spinner fa-spin" />;
};
