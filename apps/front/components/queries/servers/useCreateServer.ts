import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {CreateServerDto, CreateServerResponseDto} from '@shared/dto';
import {createServer} from '@front/components/actions/createServer';

export const useCreateServer = () => {
    const queryClient = getQueryClient();

    return useMutation<CreateServerResponseDto, Error, CreateServerDto>(
        {
            mutationFn: createServer,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                    refetchType: 'all',
                });
            },
        },
        queryClient,
    );
};
