import { revalidateSiteLayout } from "@/_actions/revalidate";
import useCookies from "@/_hooks/storage/use-cookies.hook";
import { api } from "@/_lib/api";
import { SESSION_TOKEN_COOKIE } from "@/_lib/constants";
import { useToast } from "@repo/web-ui/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

const useSignInMutation = () => {
  const [cookies] = useCookies();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await api
        .post("rest/auth/login", {
          headers: {
            Authorization: `Bearer ${cookies[SESSION_TOKEN_COOKIE]}`,
          },
          json: {
            userName: email,
            password,
          },
        })
        .json<{
          status_code: string;
          user_id: number;
          authentication: {
            authorities: {
              authority: string;
            }[];
            name: string;
            change_password?: boolean;
            is_sales_rep?: boolean;
          };
        }>();

      const { status_code, user_id, authentication } = response;

      const authorities = authentication?.authorities;
      const authority = authorities?.[0]?.authority;

      const transformData = {
        statusCode: status_code,
        userId: user_id,
        authentication: {
          authorities: {
            authority: authority,
          },
          name: authentication?.name,
          changePassword: authentication?.change_password,
          isSalesRep: authentication?.is_sales_rep,
        },
      };

      return transformData;
    },
    onSuccess: async (data) => {
      toast({
        title: "Sign in successful",
      });
      queryClient.invalidateQueries();

      if (
        data.authentication.changePassword &&
        !pathname.startsWith("/password-reset")
      ) {
        return router.push(`/password-reset?user=${data.userId}`);
      }
      if (data.authentication.isSalesRep) {
        return revalidateSiteLayout("/osr/dashboard");
      }

      await revalidateSiteLayout("/");
    },
  });
};

export default useSignInMutation;
